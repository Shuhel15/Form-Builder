"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess("Login successful !");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again later.");
      console.error("Error while logging in user:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center py-10">
      <div className="grid w-full max-w-6xl grid-cols-1 shadow-lg md:grid-cols-2">

        {/* Left div */}
        <div className="hidden flex-col gap-2 rounded-l-lg bg-white p-10 text-black md:flex">
          <h1 className="text-2xl font-semibold">Form Builder</h1>

          <p>• Build Forms in just one minute</p>
          <p>• Share with anyone just a link</p>
          <p>• See records in dashboard</p>
        </div>

        {/* Right div */}
        <div className="flex min-h-137.5 w-full flex-col items-center justify-center rounded-lg bg-black py-10 text-white md:rounded-l-none md:rounded-r-lg">

          <h1 className="py-2 text-2xl font-semibold">
            Login Page
          </h1>

          {error && (
            <p className="py-2 text-red-500">
              {error}
            </p>
          )}

          {success && (
            <p className="py-2 text-green-500">
              {success}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-stretch justify-center gap-2 px-10 sm:w-[80%] md:w-[70%] lg:w-[60%]"
          >
            <label>Email:</label>

            <input
              type="email"
              name="email"
              value={email}
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-zinc-800 p-2 text-white outline-none focus:border-white"
            />

            <label>Password:</label>

            <input
              type="password"
              name="password"
              value={password}
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2 rounded-md border border-zinc-800 p-2 text-white outline-none focus:border-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-emerald-500 px-4 py-2 font-semibold text-white transition-transform duration-150 hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <a
              href="/register"
              className="mt-1 text-center text-xs text-zinc-500 sm:text-sm"
            >
              Don&apos;t have an account?{" "}
              <span className="text-zinc-300 hover:underline">
                Register
              </span>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}