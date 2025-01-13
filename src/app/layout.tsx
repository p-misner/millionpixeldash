import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./reset.css";
import StyledComponentsRegistry from "./registry";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Million Pixel Dash",
  description: "How fast can you scroll through a million pixels?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-MTGT46SR" />

      <body className={`${leagueSpartan.className}`}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
      <GoogleAnalytics gaId="G-MLSGGEZRVL" />
    </html>
  );
}
