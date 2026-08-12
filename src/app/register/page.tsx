"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        setError(data.message);
        return;
      }

      setSuccess(data.message);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.log("Error while registering user:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div
        className=" w-full max-w-4xl min-h-auto md:min-h-137.5 flex bg-white rounded-xl shadow-lg overflow-hidden  flex-col md:flex-row
        "
      >
        {/* Left Div */}
        <div
          className=" hidden md:flex md:w-[80%]  bg-white text-black w-[80%] flex-col justify-center px-12
  "
        >
          <h1 className="text-4xl font-bold mb-4">Form Builder</h1>

          <p>• Build Forms in just one minute</p>
          <p>• Share with anyone just a link</p>
          <p>• See records in dashboard</p>
        </div>

        {/* Right Div */}
        <div
          className=" w-full  bg-black text-white md:w-[80%] flex flex-col items-center justify-center px-6 py-8 sm:px-10 rounded-b-xl md:rounded-b-none md:rounded-r-xl
          "
        >
          <h1 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
            Register Yourself First
          </h1>

          {error && (
            <p className="text-red-500 text-sm py-2 text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-500 text-sm py-2 text-center">{success}</p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-sm gap-2"
          >
            <label className="text-sm sm:text-base">Name:</label>

            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" w-full outline-none focus:border-white text-white border border-zinc-800 rounded-md p-2 mb-2 text-sm sm:text-base
              "
            />

            <label className="text-sm sm:text-base">Email:</label>

            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" w-full outline-none focus:border-white text-white border border-zinc-800 rounded-md p-2 mb-2 text-sm sm:text-base
              "
            />

            <label className="text-sm sm:text-base">Password:</label>

            <input
              type="password"
              id="password"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" w-full outline-none focus:border-white text-white border border-zinc-800 rounded-md p-2 mb-2 text-sm sm:text-base
              "
            />

            <button
              type="submit"
              className=" w-full bg-blue-500 hover:bg-blue-600 font-semibold text-white rounded-md p-2 mt-2 active:scale-95 transition-all duration-100
              "
            >
              Register
            </button>

            <a
              href="/login"
              className="text-center text-xs sm:text-sm text-zinc-500 mt-2"
            >
              Already have an account?{" "}
              <span className="hover:underline text-zinc-300">Login</span>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
