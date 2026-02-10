import Link from "next/link";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t py-12 bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              RideShare
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              Moving you forward with safety, style, and sustainability. The standard for modern travel.
            </p>
            <div className="pt-4 text-xs text-zinc-400 dark:text-zinc-500">
              © {currentYear} RideShare Inc. <br /> All rights reserved.
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product */}
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/book" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Ride
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Drive
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white">Follow Us</h3>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            
            <div className="pt-4">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">Download the app</p>
                <div className="flex gap-2">
                    <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded px-2 flex items-center justify-center text-[10px] text-zinc-500 font-medium cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700">App Store</div>
                    <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded px-2 flex items-center justify-center text-[10px] text-zinc-500 font-medium cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700">Google Play</div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
