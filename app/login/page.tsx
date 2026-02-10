"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Car } from "lucide-react";
import { RideDemo } from "@/components/Auth/RideDemo";

export default function LoginPage() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login(username, password);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
      toast.error(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 relative items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-zinc-950 to-blue-900/40 bg-[length:300%_300%] animate-aurora blur-3xl opacity-50 pointer-events-none" />
          
           {/* Blob Animation (optional consistency) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[80px] animate-blob pointer-events-none" />

          {/* Ride Demo Animation */}
          <div className="relative z-10 w-96">
             <RideDemo />
          </div>

           {/* Footer */}
           <div className="absolute bottom-8 text-center w-full z-10">
              <p className="text-zinc-500 text-sm">© 2026 RideShare Inc. Premium Mobility.</p>
           </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
               {/* Mobile Logo */}
               <div className="lg:hidden flex justify-center mb-6">
                 <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-2 rounded-xl">
                   <Car className="h-6 w-6" />
                 </div>
               </div>
               
               <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back</h1>
               <p className="text-zinc-500 dark:text-zinc-400 mt-2">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <Label htmlFor="username" className="sr-only">Username</Label>
                  <div className="relative">
                     <div className="absolute left-3 top-3 text-zinc-400">
                        <Mail className="w-5 h-5" />
                     </div>
                     <Input
                      id="username"
                      type="text"
                      placeholder="Username or Email"
                      className="pl-10 h-11 bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                       className="pl-10 h-11 bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                     />
                  </div>
                  <div className="flex justify-end">
                     <Button variant="link" className="px-0 font-normal text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" type="button">Forgot password?</Button>
                  </div>
               </div>

               <Button 
                  type="submit" 
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 font-bold transition-all"
                  disabled={isSubmitting || isLoading}
               >
                  {(isSubmitting || isLoading) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
               </Button>

               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                  </div>
               </div>

               <Button variant="outline" type="button" className="w-full h-11 bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 font-medium">
                  {/* Simple Google G Icon */}
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                     <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Google
               </Button>
            </form>

            <p className="text-center text-sm text-zinc-500 text-muted-foreground">
               Don&apos;t have an account?{" "}
               <Link href="/register" className="font-semibold text-zinc-900 dark:text-white hover:underline transition-all">
                  Sign up
               </Link>
            </p>
         </div>
      </div>
    </div>
  );
}
