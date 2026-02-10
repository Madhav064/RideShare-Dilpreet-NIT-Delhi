"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Car, 
  ChevronDown, 
  User, 
  CreditCard, 
  LogOut, 
  LayoutDashboard, 
  History, 
  MapPin,
  Settings
} from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/history", label: "Ride History", icon: History },
    { href: "/book", label: "Book a Ride", icon: MapPin },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Car className="h-6 w-6 text-zinc-900 dark:text-white transition-transform duration-200 group-hover:scale-110" />
          <span className="font-extrabold tracking-tight text-2xl text-zinc-900 dark:text-white">
            Ride<span>Share</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 ml-auto mr-6">
          {navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link
                 key={item.href}
                 href={item.href}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                   isActive 
                     ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold" 
                     : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                 }`}
               >
                 {item.label}
               </Link>
             )
          })}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="pl-2 pr-1 h-10 rounded-full flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                    <AvatarImage src={user.image || user.avatarUrl} alt={user.firstName || user.name} />
                    <AvatarFallback className="bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 font-bold">
                        {(user.firstName || user.name || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                </DropdownMenuItem>
                 <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-300 dark:shadow-none">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader className="text-left border-b pb-4 mb-4">
                        <SheetTitle className="flex items-center gap-2">
                             <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-1 rounded-md">
                                <Car className="h-4 w-4" />
                            </div>
                            <span className="font-bold">RideShare</span>
                        </SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => (
                             <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                    pathname === item.href
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
                                    : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto pt-8 border-t flex flex-col gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-2 py-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.image || user.avatarUrl} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{(user.firstName || user.name || "U").charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </div>
                                <Button variant="destructive" onClick={handleLogout} className="w-full justify-start rounded-xl overflow-hidden">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <Button asChild className="w-full rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200" size="lg">
                                <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                            </Button>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </nav>
  );
}
