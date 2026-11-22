import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "available.AI — Your business, moving forward",
  description: "Plan, build and grow your business from one calm workspace."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}