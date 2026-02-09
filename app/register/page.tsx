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
    <div className="h-[calc(100vh-64px)] w-full flex bg-white dark:bg-background overflow-hidden">
      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative items-center justify-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
          </div>
          
          {/* Logo */}
          <div className="absolute top-8 left-8 flex items-center gap-2 text-white">
              {/* Logo Removed as requested */}
          </div>

          {/* Ride Demo Animation */}
          <div className="relative z-10 w-96">
             <RideDemo />
          </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-background">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
               <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">Create an account</h1>
               <p className="text-muted-foreground mt-2">Enter your details to create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="sr-only">Full Name</Label>
                <div className="relative">
                   <div className="absolute left-3 top-3 text-gray-400">
                      <User className="w-5 h-5" />
                   </div>
                   <Input
                    id="name"
                    placeholder="Full Name"
                    className="pl-10 h-11 bg-gray-50 border-gray-200 dark:border-border dark:bg-secondary focus:bg-white dark:focus:bg-background transition-colors text-black dark:text-foreground"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <div className="relative">
                   <div className="absolute left-3 top-3 text-gray-400">
                      <Mail className="w-5 h-5" />
                   </div>
                   <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    className="pl-10 h-11 bg-gray-50 border-gray-200 dark:border-border dark:bg-secondary focus:bg-white dark:focus:bg-background transition-colors text-black dark:text-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <div className="relative">
                   <div className="absolute left-3 top-3 text-gray-400">
                      <Lock className="w-5 h-5" />
                   </div>
                   <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-11 bg-gray-50 border-gray-200 dark:border-border dark:bg-secondary focus:bg-white dark:focus:bg-background transition-colors text-black dark:text-foreground"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                   />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign Up
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-muted-foreground">
               Already have an account?{" "}
               <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline transition-all">
                  Sign in
               </Link>
            </p>
         </div>
      </div>
    </div>
  );
}
