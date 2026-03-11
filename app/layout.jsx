import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Parves | Full Stack Developer",
  description: "Portfolio of Mohammed Parves — Full Stack MERN Developer from Chittagong, Bangladesh. Specializing in React, Next.js, Node.js and MongoDB.",
  keywords: ["Mohammed Parves", "Full Stack Developer", "MERN Stack", "React", "Next.js", "Portfolio", "Chittagong"],
  authors: [{ name: "Mohammed Parves" }],
  icons: {
    icon: "/favicon.svg",        // modern browsers
    shortcut: "/favicon.svg",    // older browsers
    apple: "/favicon.svg",       // iOS home screen
  },
  openGraph: {
    title: "Parves | Full Stack Developer",
    description: "Full Stack MERN Developer from Chittagong, Bangladesh.",
    type: "website",
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
