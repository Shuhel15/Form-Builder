"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ArrowLeft } from "lucide-react";

import FadeIn from "@/components/animations/FadeIn";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must include at least one special character";
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Something went wrong. Please try again later.",
        );
        return;
      }

      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error while resetting password:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeIn>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div
          className=" w-full max-w-4xl flex flex-col md:flex-row min-h-0 md:min-h-137.5 bg-transparent md:bg-white rounded-none md:rounded-xl shadow-none md:shadow-lg md:shadow-pink-300/30 overflow-hidden
          "
        >
          {/* Left Div */}
          <div
            className=" hidden md:flex md:w-[55%] bg-white text-black flex-col justify-center px-12
            "
          >
            <h1 className="text-4xl font-bold mb-4">
              Reset Your <span className="text-pink-600">Password.</span>
            </h1>

            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              Create a new password for your account and get back to managing
              your forms securely.
            </p>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-pink-100 flex items-center justify-center">
                  <LockKeyhole className="w-5 h-5 text-pink-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Create a secure password
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Use a strong password to keep your account protected.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-pink-100 flex items-center justify-center">
                  <LockKeyhole className="w-5 h-5 text-pink-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Your account stays protected
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Your password will be securely stored after resetting it.
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
              Reset Password
            </h1>

            <p className="text-zinc-500 text-sm mb-6 text-center">
              Enter your email and create a new password.
            </p>

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

              {/* New Password */}
              <label htmlFor="password" className="text-sm">
                New Password
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

              {/* Confirm Password */}
              <label htmlFor="confirmPassword" className="text-sm">
                Confirm Password
              </label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="********"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className=" w-full bg-zinc-950 text-white placeholder:text-zinc-600 border border-zinc-800 rounded-md p-2.5 mb-2 text-sm outline-none focus:border-pink-600 transition
                "
              />

              {/* Reset Button */}
              <button
                type="submit"
                disabled={loading}
                className=" w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-white rounded-md p-2.5 mt-2 active:scale-95 transition-all
                "
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className=" group  flex items-center justify-center gap-1 text-zinc-500 hover:text-pink-500 text-xs sm:text-sm mt-3 transition
                "
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200 " />
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
