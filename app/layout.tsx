import type { Metadata } from "next";
import { Space_Grotesk, Lora } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "Behavioral Threshold Model",
  description: "Interactive model exploring when personalization can become manipulation."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${lora.variable}`}>{children}</body>
    </html>
  );
}
