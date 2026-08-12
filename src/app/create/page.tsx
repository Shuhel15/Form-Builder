"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createForm } from "@/actions/form.actions";

export default function CreateFormPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await createForm(title, description);

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/forms/${result.formId}/edit`);
    setLoading(false);
    setTitle("");
    setDescription("");
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl">
      <h1 className="text-3xl font-bold">Create Form</h1>

      <p className="mt-2 text-zinc-500">
        Create a new form and start adding questions.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-5 rounded-xl border border-zinc-200 p-6 shadow-md"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-medium">
            Form Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
            className="rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-pink-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-medium">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description"
            rows={4}
            className="resize-none rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-pink-600"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-pink-600 px-5 py-3 font-medium text-white transition hover:scale-100 active:scale-95 hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Form"}
        </button>
      </form>
    </div>
  );
}