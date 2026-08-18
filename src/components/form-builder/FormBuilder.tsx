"use client";

import { useState } from "react";
import type { Form, Question } from "@prisma/client";
import { Copy, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import QuestionCard from "@/components/form-builder/QuestionCard";
import QuestionEditor from "@/components/form-builder/QuestionEditor";
import FadeIn from "../animations/FadeIn";

type FormWithQuestions = Form & {
  questions: Question[];
};

type FormBuilderProps = {
  form: FormWithQuestions;
};

export default function FormBuilder({ form }: FormBuilderProps) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to update form");
        return;
      }

      setIsEditingInfo(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating form:", error);
      setError("Failed to update form");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublishToggle() {
    setIsPublishing(true);

    try {
      const response = await fetch(`/api/forms/${form.id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !form.published,
        }),
      });

      const data: { error?: string } = await response.json();

      if (!response.ok) {
        console.error(data.error ?? "Failed to update publish status");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating publish status:", error);
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleCopyLink() {
    try {
      const publicUrl = `${window.location.origin}/forms/${form.id}`;

      await navigator.clipboard.writeText(publicUrl);

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy public link:", error);
    }
  }

  return (
    <FadeIn>
    <div className="space-y-6">
      {/* Form Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            {isEditingInfo ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="form-title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Form Title
                  </label>

                  <input
                    id="form-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="form-description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="form-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(false)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pink-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="wrap-break-word text-xl font-bold text-gray-900 sm:text-2xl">
                  {form.title}
                </h1>

                {form.description && (
                  <p className="mt-2 wrap-break-word text-sm text-gray-500">
                    {form.description}
                  </p>
                )}
              </>
            )}
          </div>

          {!isEditingInfo && (
            <button
              type="button"
              onClick={() => setIsEditingInfo(true)}
              className="flex w-full shrink-0 items-center justify-center gap-1 rounded-lg border border-pink-600 px-4 py-2.5 text-sm font-medium text-pink-600 transition hover:bg-pink-50 active:scale-95 sm:w-auto"
            >
              Edit
              <SquarePen size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>

            <p className="mt-1 text-sm text-gray-500">
              Add and manage questions in your form.
            </p>
          </div>

          <div className="grid grid-cols-3 whitespace-nowrap  gap-2 sm:flex sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/forms/${form.id}/preview`)}
              className="rounded-lg border border-pink-600 px-3 py-2.5 text-sm font-medium text-pink-600 transition hover:bg-pink-50 active:scale-95"
            >
              Preview
            </button>

            <button
              type="button"
              onClick={handlePublishToggle}
              disabled={isPublishing}
              className="rounded-lg bg-pink-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-pink-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPublishing
                ? form.published
                  ? "Unpublishing..."
                  : "Publishing..."
                : form.published
                  ? "Unpublish"
                  : "Publish"}
            </button>

            {form.published && (
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition active:scale-95 ${
                  isCopied
                    ? "border-green-500 text-green-600 hover:bg-green-50"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Copy size={15} />
                {isCopied ? "Copied!" : "Copy Link"}
              </button>
            )}

            {!form.published && (
              <button
                type="button"
                onClick={() => setIsCreatingQuestion(true)}
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
              >
                + Add
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          {isCreatingQuestion && (
            <QuestionEditor
              formId={form.id}
              onCancelAction={() => setIsCreatingQuestion(false)}
            />
          )}

          {form.questions.length === 0 && !isCreatingQuestion ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center sm:p-8">
              <p className="text-sm text-gray-500">No questions added yet.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {form.questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </FadeIn>
  );
}
