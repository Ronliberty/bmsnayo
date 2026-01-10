// app/about/layout.tsx
import type { Metadata } from "next";
import "./about.css"; // Import the page-specific CSS

export const metadata: Metadata = {
  title: "Nayo - About Us",
  description: "Learn more about Nayo and our mission",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}