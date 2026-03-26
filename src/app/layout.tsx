import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Copilot UI - Agent Command Center",
  description: "A desktop-style interface for GitHub Copilot CLI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
