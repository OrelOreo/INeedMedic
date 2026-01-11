import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/header";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";
import Footer from "@/components/shared/footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | INeedDoctor",
    default: "INeedDoctor",
  },
  description:
    "INeedDoctor est une plateforme de prise de rendez-vous médicaux en ligne, permettant aux patients de trouver rapidement un professionnel de santé et de gérer leurs consultations simplement et efficacement.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
