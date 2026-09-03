import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lyzr — The Enterprise Control Plane for AI Agents",
  description:
    "Agents built on AWS Bedrock, Azure AI, LangChain, AutoGen, or custom stacks—governed, observed, and routed through a single sovereign control plane.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-canvas font-sans text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
