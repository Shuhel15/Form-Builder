import Link from "next/link";
import { auth } from "../lib/auth";
import { LogIn, LogOut } from "lucide-react";
import MobileMenu from "../components/Home/MobileMenu";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/50 backdrop-blur-md shadow-lg shadow-pink-300/30">
      <div className="relative mx-auto flex h-15 w-full max-w-6xl items-center justify-between px-4">
        
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-black">
          Form{" "}
          <span className="bg-linear-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
            Builder
          </span>
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden items-center justify-center gap-4 md:flex">
          <Link
            href="/"
            className="rounded-sm px-2 py-0.5 text-zinc-500 transition-all duration-200 hover:scale-105 hover:bg-pink-200 hover:text-black"
          >
            Home
          </Link>

          <Link
            href="#how-to-use"
            className="rounded-sm px-2 py-0.5 text-zinc-500 transition-all duration-200 hover:scale-105 hover:bg-pink-200 hover:text-black"
          >
            How to use
          </Link>

          {session?.user ? (
            <form
              action={async () => {
                "use server";
                const { signOut } = await import("../lib/auth");
                await signOut();
              }}
            >
              <button
                type="submit"
                className="flex flex-row items-center justify-center gap-2 rounded-sm bg-pink-600 px-2 py-0.5 text-white shadow-md shadow-pink-500/50 transition-all duration-200 hover:scale-105 hover:bg-pink-700 "
              >
                Logout
                <LogOut size={16} />
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="flex flex-row items-center justify-center gap-2 rounded-sm bg-pink-600 px-2 py-0.5 text-white shadow-md shadow-pink-500/50 transition-all duration-200 hover:scale-105 hover:bg-pink-700 "
            >
              Login
              <LogIn size={16} />
            </Link>
          )}

          {session?.user && (
            <Link
              href="/dashboard"
              className="rounded-sm px-2 py-0.5 text-zinc-500 transition-all duration-200 hover:scale-105 hover:bg-pink-200 hover:text-black"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <MobileMenu isLoggedIn={!!session?.user} />
      </div>
    </nav>
  );
}