import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://parves.net"), // ← CRITICAL: needed for og images to resolve correctly
  title: {
    default: "Parves | Full Stack Developer",
    template: "%s | Parves", // ← if you add more pages, title auto-appends
  },
  description: "Portfolio of Mohammed Parves — Full Stack MERN Developer from Chittagong, Bangladesh. Specializing in React, Next.js, Node.js and MongoDB.",
  keywords: ["Mohammed Parves", "Full Stack Developer", "MERN Stack", "React", "Next.js", "Node.js", "MongoDB", "Portfolio", "Chittagong", "Bangladesh", "MDPerrfan"],
  authors: [{ name: "Mohammed Parves", url: "https://parves.net" }],
  creator: "Mohammed Parves",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Parves | Full Stack Developer",
    description: "Full Stack MERN Developer from Chittagong, Bangladesh. Specializing in React, Next.js, Node.js and MongoDB.",
    type: "website",
    url: "https://parves.net",
    siteName: "Parves Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Parves — Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parves | Full Stack Developer",
    description: "Full Stack MERN Developer from Chittagong, Bangladesh.",
    images: ["/og-image.png"],
    creator: "@mdperrfan", // ← add your twitter handle if you have one
  },
  alternates: {
    canonical: "https://parves.net", // ← tells Google this is the main URL
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system"
          enableSystem>
          {children}    
        </ThemeProvider>
      </body>
    </html>
  );
}
