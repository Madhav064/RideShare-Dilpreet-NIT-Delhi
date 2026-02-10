import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/context/AuthContext";
import { RideProvider } from "@/context/RideContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { RideStatusSimulator } from "@/components/RideStatusSimulator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RideShare",
  description: "Your smart ride booking companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <AuthProvider>
          <RideProvider>
            <Navbar />
            {children}
            <Toaster />
            <ChatWidget 
              mode="support" 
              initialMessage="Hello! How can we assist you with your rides today?"
            />
            <RideStatusSimulator />
          </RideProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
