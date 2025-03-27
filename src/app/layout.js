import { Inter } from "next/font/google";
import "./globals.scss";
import { SessionProvider } from "../components/SessionProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TalTracker - AI-Powered HR Solution",
  description:
    "Transform your HR operations with TalTracker, an AI-powered platform for job descriptions, profile analysis, training programs, and assessments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
