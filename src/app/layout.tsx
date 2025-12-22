
import "./globals.css";
import type { Metadata } from 'next';
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
import ConvexClerkProvider from "@/components/providers/ConvexClerkProvider";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const geistSans = localFont({
  src: "./panel/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./panel/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Assessiq - Next Generation Assessment Platform',
  keywords: 'AI, interview, website, service',
  description: 'Interview and Assessment with Monaco',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ConvexClerkProvider>
      </body>
    </html>
  );
}