import type { Metadata } from "next";
import "./globals.css";
import { TICKER, TOKEN_NAME } from "./config";
import { display, sans, mono } from "./fonts";

export const metadata: Metadata = {
  title: TICKER, // tab title is always just the ticker
  description: `${TOKEN_NAME} — rob the rich, feed the flock, dodge the guards. A heist runner for cats, on Solana.`,
};

export const viewport = { themeColor: "#0d0f14" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
