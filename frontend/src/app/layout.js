import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderSection from "@/common/header/page";
import FooterSection from "@/common/footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LMS",
  description: "Learning Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <HeaderSection />
        {children}
        <FooterSection />
      </body>
    </html>
  );
}

// NEXT_PUBLIC_API_URL = http://localhost:5555/
// # http://localhost:5555/api/auth/login-page
// # http://localhost:5555/api/auth/register-user