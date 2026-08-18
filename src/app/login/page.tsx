"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Zap, Link, BarChart3 } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

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

      setSuccess("Login successful!");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error while logging in user:", error);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <FadeIn>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl flex flex-col md:flex-row min-h-0 md:min-h-137.5 bg-transparent md:bg-white rounded-none md:rounded-xl shadow-none 
        md:shadow-lg md:shadow-pink-300/30 overflow-hidden">
          {/* Left Div */}
          <div
            className=" hidden md:flex md:w-[55%] bg-white text-black flex-col justify-center px-12
          "
          >
            <h1 className="text-4xl font-bold mb-4">
              Welcome <span className="text-pink-600">Back.</span>
            </h1>

            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              Manage your forms, collect responses, and keep everything
              organized — all in one place.
            </p>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-pink-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Build forms in minutes
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create professional forms without writing any code.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Link className="w-5 h-5 text-pink-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Share with anyone
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Share your form instantly with a simple link.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-pink-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-pink-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Track responses easily
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    View and manage all your responses from one dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Div */}
          <div
            className=" w-full md:w-[45%] bg-black text-white flex flex-col items-center justify-center px-6 py-10 sm:px-10 rounded-xl md:rounded-l-none
          "
          >
            <h1 className="text-xl sm:text-2xl font-semibold mb-2">
              Welcome Back
            </h1>

            <p className="text-zinc-500 text-sm mb-6 text-center">
              Login to continue to your account.
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
            )}

            {success && (
              <p className="text-green-500 text-sm mb-3 text-center">
                {success}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full max-w-sm gap-2"
            >
              {/* Email */}
              <label htmlFor="email" className="text-sm">
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" w-full bg-zinc-950 text-white placeholder:text-zinc-600 border border-zinc-800 rounded-md p-2.5 mb-2 text-sm outline-none focus:border-pink-600 transition
              "
              />

              {/* Password */}
              <label htmlFor="password" className="text-sm">
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required
                className=" w-full bg-zinc-950 text-white placeholder:text-zinc-600 border border-zinc-800 rounded-md p-2.5 mb-2 text-sm outline-none focus:border-pink-600 transition
              "
              />

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className=" w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-white rounded-md p-2.5 mt-2 active:scale-95 transition-all
              "
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Register */}
              <a
                href="/register"
                className="text-center text-xs sm:text-sm text-zinc-500 mt-3"
              >
                Don&apos;t have an account?{" "}
                <span className="text-zinc-300 hover:text-pink-500 hover:underline">
                  Register
                </span>
              </a>
            </form>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
