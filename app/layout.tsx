import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
})

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EditScape",
  description: "Lesson WYSIWYG editor demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${interSans.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          // enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
