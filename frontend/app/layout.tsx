import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ali-hamza.me/"),
  title: "Pre-Flight Check for Agents - CI for agent behavior.",
  description:
    "Stress-test any AI agent with normal and adversarial conversations, then get a reliability score and failure report.",
};

export default function PreFlightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} flex flex-col items-center px-3.5 antialiased`}
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {children}
      </body>
    </html>
  );
}
