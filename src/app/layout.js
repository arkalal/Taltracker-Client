import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TalTracker - AI-Powered HR Solution",
  description:
    "Transform your HR operations with TalTracker, an AI-powered platform for job descriptions, profile analysis, training programs, and assessments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
