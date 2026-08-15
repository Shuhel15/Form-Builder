"use client";
import { useState } from "react";
import type { Question } from "@prisma/client";
import { useRouter } from "next/navigation";

type QuestionEditorProps = {
  question: Question;
  onCancelAction: () => void;
};

const questionTypes = [
  { value: "SHORT_TEXT", label: "Short Text" },
  { value: "LONG_TEXT", label: "Long Text" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "CHECKBOX", label: "Checkbox" },
  { value: "DROPDOWN", label: "Dropdown" },
  { value: "NUMBER", label: "Number" },
  { value: "EMAIL", label: "Email" },
  { value: "DATE", label: "Date" },
] as const;

export default function QuestionEditor({
  question,
  onCancelAction,
}: QuestionEditorProps) {
  const [title, setTitle] = useState(question.title);
  const [type, setType] = useState(question.type);
  const [required, setRequired] = useState(question.required);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSave() {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/questions/${question.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          type,
          required,
        }),
      });

      const data: {
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to update question");
        return;
      }

      router.refresh();
      onCancelAction();
    } catch (error) {
      console.error("Update question error:", error);
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-pink-200 bg-white p-5">
      <div>
        <label htmlFor={`question-${question.id}`}>Question</label>
        <input
          id={`question-${question.id}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
          placeholder="Enter your question"
        />

        <div>
          <label htmlFor={`type-${question.id}`}>Type</label>
          <select
            id={`type-${question.id}`}
            value={type}
            onChange={(e) =>
              setType(e.target.value as (typeof questionTypes)[number]["value"])
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
          >
            {questionTypes.map((questionType) => (
              <option key={questionType.value} value={questionType.value}>
                {questionType.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Required</p>

            <p className="text-xs text-gray-500">
              User must answer this question
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRequired((current) => !current)}
            aria-pressed={required}
            className={`relative h-6 w-11 rounded-full transition ${
              required ? "bg-pink-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                required ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={onCancelAction}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
