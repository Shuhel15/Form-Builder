"use client";

import { useState } from "react";
import type { Form, Question } from "@prisma/client";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
  return (
    <div className="space-y-6">
      {/* Form Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
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

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95"
                  >
                    Cancel
                  </button>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">
                  {form.title}
                </h1>

                {form.description && (
                  <p className="mt-2 text-sm text-gray-500">
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
              className="rounded-lg flex flex-row justify-center items-center gap-1 border border-pink-600 px-4 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-50 active:scale-95"
            >
              Edit
              <SquarePen size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>

            <p className="mt-1 text-sm text-gray-500">
              Add and manage questions in your form.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pink-700 active:scale-95 "
          >
            + Add Question
          </button>
        </div>

        <div className="mt-6">
          {form.questions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-sm text-gray-500">No questions added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <p className="text-sm text-gray-500">Question {index + 1}</p>

                  <p className="mt-1 font-medium text-gray-900">
                    {question.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
