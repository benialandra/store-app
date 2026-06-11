import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import SecurityGuard from "@/components/SecurityGuard";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "DevStore | Premium Code Scripts & Templates",
  description: "Supercharge your workflow with high-quality, production-ready code.",
};

import { ThemeProvider } from "@/context/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ThemeProvider>
          <LanguageProvider>
            <SecurityGuard />
            <Navbar />
            {children}
            <Footer />
            <Script 
              src="https://app.sandbox.midtrans.com/snap/snap.js" 
              data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_CLIENT_KEY_HERE'}
              strategy="lazyOnload"
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
