import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";



export const metadata: Metadata = {
  title: "Form Builder",
  description: "Form builder is a platform that allows user to create Google forms like forms with response download options",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
<html>
  <body className="min-h-screen w-full overflow-x-hidden bg-white">
    <Navbar />

    <main className="mx-auto w-full max-w-6xl px-4">
      {children}
    </main>
    <Footer/>
  </body>
</html>
  );
}
