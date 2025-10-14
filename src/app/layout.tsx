import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/store/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Forma recomendada: Metadata API
export const metadata: Metadata = {
  title: "Sistema de Gerenciamento Afap",
  robots: "noindex, nofollow",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html translate="no" lang="pt-BR">
      <head /> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>

        <Toaster expand  richColors theme="light" position="bottom-right" />
      </body>
    </html>
  );
}
