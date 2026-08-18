"use client";

import Link from "next/link";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const menuVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
};

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-2 text-zinc-600 hover:bg-pink-100"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="fixed left-0 right-0 top-15 z-100 w-full bg-white shadow-lg md:hidden"
          >
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2 p-4"
            >
              <motion.div variants={itemVariants}>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-pink-100"
                >
                  Home
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link
                  href="/form"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-pink-100"
                >
                  How to use
                </Link>
              </motion.div>

              {isLoggedIn && (
                <motion.div variants={itemVariants}>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-2 hover:bg-pink-100"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              )}

              {isLoggedIn ? (
                <motion.div variants={itemVariants}>
                  <form action="/api/auth/signout" method="POST">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-md bg-pink-600 px-3 py-2"
                    >
                      Logout
                      <LogOut size={16} />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants}>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-md bg-pink-600 px-3 py-2"
                  >
                    Login
                    <LogIn size={16} />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}