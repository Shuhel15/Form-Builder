"use client";

import type { Form, Question, QuestionType } from "@prisma/client";
import { useState } from "react";

type FormWithQuestions = Form & {
  questions: Question[];
};

type FormPreviewProps = {
  form: FormWithQuestions;
};

type Options = string[];

function getOptions(options: Question["options"]): Options {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.filter((option): option is string => typeof option === "string");
}

export default function FormPreview({ form }: FormPreviewProps) {
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;

    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    setError(
      "Preview only — your response has not been submitted or saved."
    );
  }

  function renderQuestion(question: Question) {
    const options = getOptions(question.options);

    const commonClasses =
      "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20";

    switch (question.type as QuestionType) {
      case "SHORT_TEXT":
        return (
          <input
            type="text"
            name={question.id}
            required={question.required}
            className={commonClasses}
          />
        );

      case "LONG_TEXT":
        return (
          <textarea
            name={question.id}
            rows={4}
            required={question.required}
            className={`${commonClasses} resize-none`}
          />
        );

      case "MULTIPLE_CHOICE":
        return (
          <div className="space-y-3">
            {options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  required={question.required}
                  className="h-4 w-4 accent-pink-600"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "CHECKBOX":
        return (
          <div className="space-y-3">
            {options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  name={question.id}
                  value={option}
                  className="h-4 w-4 accent-pink-600"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "DROPDOWN":
        return (
          <select
            name={question.id}
            required={question.required}
            defaultValue=""
            className={commonClasses}
          >
            <option value="" disabled>
              Select an option
            </option>

            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "NUMBER":
        return (
          <input
            type="number"
            name={question.id}
            required={question.required}
            className={commonClasses}
          />
        );

      case "EMAIL":
        return (
          <input
            type="email"
            name={question.id}
            required={question.required}
            className={commonClasses}
          />
        );

      case "DATE":
        return (
          <input
            type="date"
            name={question.id}
            required={question.required}
            className={commonClasses}
          />
        );

      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header */}
      <div className="rounded-2xl border border-gray-200 border-t-4 border-t-pink-600 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {form.title}
        </h1>

        {form.description && (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600 sm:text-base">
            {form.description}
          </p>
        )}
      </div>

      {/* Questions */}
      {form.questions.map((question) => (
        <div
          key={question.id}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <label className="mb-4 block text-sm font-medium text-gray-900 sm:text-base">
            {question.title}

            {question.required && (
              <span className="ml-1 text-pink-600" aria-label="required">
                *
              </span>
            )}
          </label>

          {renderQuestion(question)}
        </div>
      ))}

      {/* Submit */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <button
          type="submit"
          className="rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pink-700 active:scale-95"
        >
          Submit
        </button>

        {error && (
          <p className="mt-3 text-sm text-pink-600">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}