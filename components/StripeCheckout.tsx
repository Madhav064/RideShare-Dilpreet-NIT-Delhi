"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

// Initialize Stripe outside of the component to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutFormProps {
  onSuccess: () => void;
  amount: number;
}

const CheckoutForm = ({ onSuccess, amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      onSuccess();
    } else {
      toast.error("Payment failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
      >
        {isLoading ? "Processing..." : `Pay ${formatCurrency(amount)}`}
      </Button>
    </form>
  );
};

interface StripeCheckoutProps {
  amount: number;
  onSuccess: () => void;
}

export default function StripeCheckout({
  amount,
  onSuccess,
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          toast.error("Failed to initialize payment: " + (data.error || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error("Error fetching payment intent:", error);
        toast.error("An error occurred while initializing payment.");
      });
  }, [amount]);

  if (!clientSecret) {
    return <div className="text-center p-4 text-zinc-500 text-sm">Loading secure payment...</div>;
  }

  const appearance = {
    theme: theme === 'dark' ? 'night' as const : 'stripe' as const,
    variables: {
      colorPrimary: theme === 'dark' ? '#ffffff' : '#09090b',
      colorBackground: theme === 'dark' ? '#18181b' : '#ffffff', // zinc-900 / white
      colorText: theme === 'dark' ? '#ffffff' : '#09090b',
      colorDanger: '#ef4444',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
    rules: {
      '.Input': {
        border: '1px solid',
        borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7', // zinc-800 / zinc-200
        boxShadow: 'none',
      },
      '.Input:focus': {
        borderColor: theme === 'dark' ? '#ffffff' : '#09090b',
        boxShadow: 'none',
        outline: 'none',
      },
      '.Label': {
        fontWeight: '500',
        color: theme === 'dark' ? '#a1a1aa' : '#52525b', // zinc-400 / zinc-600
      }
    }
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm onSuccess={onSuccess} amount={amount} />
    </Elements>
  );
}
