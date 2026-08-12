import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { auth } from "../../lib/auth";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
});

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative mt-20 grid grid-cols-1 items-center gap-4 md:grid-cols-2">
      <div className="pointer-events-none absolute left-60  top-40 h-40 w-40 rounded-full bg-pink-400/30 blur-3xl" />

      <div className="relative z-10">
        <h1 className=" text-4xl md:text-7xl font-extrabold">
          Build Forms.
          <br />
          <span
            className={`${playfair.className} relative inline-block pb-2 text-pink-600 mt-2 mb-2`}
          >
            Collect Data.
            <svg
              className="absolute left-0 -mt-2 w-full"
              viewBox="0 0 200 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 13C45 5 80 18 112 10C142 3 170 7 197 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <br />
          Get things done.
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          A simple form builder designed to help you create, share, and manage
          forms faster.
        </p>
        <div className="flex flex-row items-center">
          <Link
            href={session?.user ? "/dashboard" : "/login"}
            className="group mt-6 flex flex-row justify-center items-center gap-2 rounded-lg bg-pink-600 px-6 py-3 text-lg font-semibold text-white duration-300 hover:bg-pink-700
          shadow-xl shadow-pink-300 active:scale-95 transition-all hover:scale-105"
          >
            Get Started{" "}
            <MoveRight className="group-hover:transition-transform group-hover:translate-x-1 " />
          </Link>

          <button
            className="mt-6 ml-4 rounded-lg border border-pink-600 px-6 py-3 text-lg font-semibold text-pink-600 transition-all duration-300 hover:bg-pink-50
          hover:shadow-xl hover:shadow-pink-300 active:scale-95 hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-10  top-70 h-40 w-40 rounded-full bg-pink-400/30 blur-3xl" />
      <div className="relative z-10 mt-30 md:mt-0 flex items-center justify-center">
        <Image
          src="/hero1.png"
          alt="hero"
          width={800}
          height={800}
          className="h-auto w-full max-w-200 rounded-xl shadow-xl shadow-pink-300/30 transition-all duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
}
