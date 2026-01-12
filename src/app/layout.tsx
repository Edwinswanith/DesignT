import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DesignT | Premium Custom T-Shirts with AI Design Studio",
  description:
    "Create unique, personalized t-shirts with AI-powered design generation. Premium bamboo-cotton blend fabric with DTF printing. Chennai-first delivery.",
  keywords: [
    "custom t-shirts",
    "AI design",
    "personalized apparel",
    "Chennai",
    "premium t-shirts",
    "bamboo cotton",
  ],
  authors: [{ name: "DesignT" }],
  openGraph: {
    title: "DesignT | Premium Custom T-Shirts with AI Design Studio",
    description:
      "Create unique, personalized t-shirts with AI-powered design generation. Premium bamboo-cotton blend fabric.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
