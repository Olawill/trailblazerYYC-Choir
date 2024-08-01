import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import Providers from "@/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trailblazer YYC",
  description: "Created to manage the activity of the choir at TCIC YYC",
  openGraph: {
    title: {
      default: "Trailblazer YYC",
      template: "%s | Trailblazer YYC",
    },
    description: "Created to manage the activity of the choir at TCIC YYC",
    url: "https://trailblazer-yyc.vercel.app",
    siteName: "Trailblazer YYC",
    locale: "en-CA",
    type: "website",
  },
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
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            // enableColorScheme
            enableSystem
            disableTransitionOnChange
          >
            <Providers>{children}</Providers>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
