import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "available.AI — Your AI business operator",
  description: "Plan, build, grow and earn with one AI-powered business workspace."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}