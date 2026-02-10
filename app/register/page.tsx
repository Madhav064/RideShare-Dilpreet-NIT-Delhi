"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, Car } from "lucide-react";
import { RideDemo } from "@/components/Auth/RideDemo";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Account created! Please log in with test credentials.");
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 relative items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-zinc-950 to-blue-900/40 bg-[length:300%_300%] animate-aurora blur-3xl opacity-50 pointer-events-none" />
          
           {/* Blob Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[80px] animate-blob pointer-events-none" />

          {/* Ride Demo Animation */}
          <div className="relative z-10 w-96">
             <RideDemo />
          </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
               <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Create an account</h1>
               <p className="text-zinc-500 mt-2">Enter your details to create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="sr-only">Full Name</Label>
                <div className="relative">
                   <div className="absolute left-3 top-3 text-zinc-400">
                      <User className="w-5 h-5" />
                   </div>
                   <Input
                    id="name"
                    placeholder="Full Name"
                    className="pl-10 h-11 bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <div className="relative">
                   <div className="absolute left-3 top-3 text-zinc-400">
                      <Mail className="w-5 h-5" />
                   </div>
                   <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    className="pl-10 h-11 bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <div className="relative">
                   <div className="absolute left-3 top-3 text-zinc-400">
                      <Lock className="w-5 h-5" />
                   </div>
                   <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-11 bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                   />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-all mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign Up
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-500">
               Already have an account?{" "}
               <Link href="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline underline-offset-4 transition-all">
                  Sign in
               </Link>
            </p>
         </div>
      </div>
    </div>
  );
}
