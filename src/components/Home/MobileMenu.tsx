"use client";

import Link from "next/link";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useState } from "react";

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-2 text-zinc-600 hover:bg-pink-100"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

{isOpen && (
  <div className="fixed left-0 right-0 top-15 z-100 w-full bg-white shadow-lg md:hidden">
    <div className="flex flex-col gap-2 p-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 hover:bg-pink-100"
            >
              Home
            </Link>

            <Link
              href="/form"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 hover:bg-pink-100"
            >
              How to use
            </Link>

            {isLoggedIn && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 hover:bg-pink-100"
              >
                Dashboard
              </Link>
            )}

            {isLoggedIn ? (
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-md bg-pink-600 px-3 py-2"
                >
                  Logout
                  <LogOut size={16} />
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-md bg-pink-600 px-3 py-2"
              >
                Login
                <LogIn size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}