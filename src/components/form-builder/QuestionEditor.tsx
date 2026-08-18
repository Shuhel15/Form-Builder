"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionTypeSelector from "./QuestionTypeSelector";
import type { Question, QuestionType } from "@prisma/client";
import FadeIn from "../animations/FadeIn";

type QuestionEditorProps =
  | {
      question: Question;
      formId?: never;
      onCancelAction: () => void;
    }
  | {
      question?: never;
      formId: string;
      onCancelAction: () => void;
    };

export default function QuestionEditor({
  question,
  formId,
  onCancelAction,
}: QuestionEditorProps) {
  const [title, setTitle] = useState(question?.title ?? "");
  const [type, setType] = useState<QuestionType>(
    question?.type ?? "SHORT_TEXT",
  );
  const [required, setRequired] = useState(question?.required ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [options, setOptions] = useState<string[]>(() => {
    if (Array.isArray(question?.options)) {
      return question.options.filter(
        (option): option is string => typeof option === "string",
      );
    }

    return [];
  });

  function isOptionQuestion() {
    return (
      type === "MULTIPLE_CHOICE" || type === "CHECKBOX" || type === "DROPDOWN"
    );
  }

  function handleAddOption() {
    setOptions((current) => [...current, ""]);
  }

  function handleOptionChange(index: number, value: string) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? value : option,
      ),
    );
  }

  function handleDeleteOption(index: number) {
    setOptions((current) =>
      current.filter((_, optionIndex) => optionIndex !== index),
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setError("");

    try {
      const isCreating = !question;

      const url = isCreating
        ? `/api/forms/${formId}/questions`
        : `/api/questions/${question.id}`;

      const response = await fetch(url, {
        method: isCreating ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          type,
          required,
          options: isOptionQuestion()
            ? options
                .map((option) => option.trim())
                .filter((option) => option.length > 0)
            : undefined,
        }),
      });

      const data: {
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            (isCreating
              ? "Failed to create question"
              : "Failed to update question"),
        );
        return;
      }

      router.refresh();
      onCancelAction();
    } catch (error) {
      console.error("Question save error:", error);
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FadeIn>
      <div className="rounded-xl border border-pink-200 bg-white p-5">
        <div className="py-2">
          <label htmlFor={`question-${question?.id ?? "new"}`}>Question</label>
          <input
            id={`question-${question?.id ?? "new"}`}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
            placeholder="Enter your question"
          />

          <div className="py-2">
            <QuestionTypeSelector value={type} onChangeAction={setType} />
          </div>

          {isOptionQuestion() && (
            <div className="mt-4 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Options</p>

                  <p className="text-xs text-gray-500">
                    Add the choices users can select.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-sm font-medium text-pink-600 hover:text-pink-700"
                >
                  + Add Option
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"
                  >
                    <input
                      type="text"
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(index, event.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteOption(index)}
                      className="shrink-0 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
    </FadeIn>
  );
}
