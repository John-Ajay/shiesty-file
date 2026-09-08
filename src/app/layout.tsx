import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROJECT SHIESTY // CASE FILE #0001",
  description: "CLASSIFIED // UNAUTHORIZED ACCESS PROHIBITED",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#e8e6e1]">
        {children}
      </body>
    </html>
  );
}
