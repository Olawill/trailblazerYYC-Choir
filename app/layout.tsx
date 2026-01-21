import { auth } from "@/auth";
import { DynamicFontLoader } from "@/components/dynamic-font-loader";
import { FontInitializer } from "@/components/font-initializer";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/providers";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

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
      <html lang="en" suppressHydrationWarning>
        <head>
          <DynamicFontLoader />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </head>
        <body className={poppins.variable}>
          <FontInitializer />
          <Toaster richColors />
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
