import Link from "next/link";
import { auth } from "@/lib/auth";
import { Heart } from "lucide-react";
import FadeIn from "../animations/FadeIn";

export default async function Footer() {
  const session = await auth();

  return (
    <FadeIn>
    <footer className="mt-20 w-full border-t border-pink-300 py-8">
      
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4">

        {/* Top Row - Logo & Navigation */}
        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* Logo */}
          <h1 className="text-2xl font-extrabold">
            Form <span className="text-pink-600">Builder</span>
          </h1>

          {/* Navigation */}
          <nav>
            
            <ul className="group flex flex-col items-center gap-4 text-sm text-gray-600 md:flex-row">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-300 hover:text-pink-600 "
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/#how-to-use"
                  className="transition-colors duration-300 hover:text-pink-600"
                >
                  How to Use
                </Link>
              </li>

              <li>
                <Link
                  href={session?.user ? "/dashboard" : "/login"}
                  className="transition-colors duration-300 hover:text-pink-600"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Middle Row - Author & Links */}
        <div className="flex flex-col items-center gap-3 text-sm text-gray-600">
          
          {/* Made With */}
          <p className="flex items-center justify-center gap-1">
            Made with
            <Heart
              size={16}
              className="animate-pulse fill-pink-600 text-pink-600"
            />
            by
            <span className="font-medium text-gray-800">
              Shuhel Ahmed
            </span>
          </p>

          {/* Social / Personal Links */}
          <div className="flex items-center gap-5">
            <Link
              href="https://github.com/Shuhel15"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-pink-600"
            >
              GitHub
            </Link>

            <Link
              href="https://shuhel.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-pink-600"
            >
              Portfolio
            </Link>
          </div>
        </div>

        {/* Bottom Row - Copyright */}
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Form Builder. All rights reserved.
        </p>
      </div>
    </footer>
    </FadeIn>
  );
}