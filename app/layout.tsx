import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import MobileNavbar from "@/components/navbar/mobile-navbar";
import DesktopNavbar from "@/components/navbar/desktop-navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trailblazer YYC",
  description: "Created to manage the affairs of the choir at TCIC YYC",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <MobileNavbar />
          <DesktopNavbar />
          <div className="">{children}</div>
        </body>
      </html>
    </SessionProvider>
  );
}
