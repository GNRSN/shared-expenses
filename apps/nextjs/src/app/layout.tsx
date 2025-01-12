import type { Metadata, Viewport } from "next";

import { ThemeProvider, ThemeToggle } from "@@/ui/theme";
import { Toaster } from "@@/ui/toast";
import { cn } from "@@/ui/utils";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";
import { defaultFontsClassName } from "~/utils/fonts";
import Header from "./_components/header";

const PRODUCTION_DOMAIN =
  "https://shared-expensesnext-js-gnrsns-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? PRODUCTION_DOMAIN
      : "http://localhost:3000",
  ),
  title: "Shared expenses",
  description: "",
  openGraph: {
    title: "Shared expenses",
    description: "",
    url: PRODUCTION_DOMAIN,
    siteName: "Shared expenses",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          defaultFontsClassName,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Header />

          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
