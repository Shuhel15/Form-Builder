"use client";

import { useState } from "react";
import type { Form, Question } from "@prisma/client";

type PublicFormProps = {
  form: Form & {
    questions: Question[];
  };
};

type AnswerValue = string | string[];

export default function PublicForm({ form }: PublicFormProps) {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  function handleTextChange(questionId: string, value: string) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  function handleCheckboxChange(
    questionId: string,
    option: string,
    checked: boolean,
  ) {
    const currentValue = answers[questionId];

    const currentAnswers = Array.isArray(currentValue) ? currentValue : [];

    const updatedAnswers = checked
      ? [...currentAnswers, option]
      : currentAnswers.filter((item) => item !== option);

    setAnswers((previous) => ({
      ...previous,
      [questionId]: updatedAnswers,
    }));
  }

  function renderQuestion(question: Question) {
    const value = answers[question.id] ?? "";

    switch (question.type) {
      case "SHORT_TEXT":
        return (
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(event) =>
              handleTextChange(question.id, event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
          />
        );

      case "LONG_TEXT":
        return (
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(event) =>
              handleTextChange(question.id, event.target.value)
            }
            rows={5}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
          />
        );

      case "NUMBER":
        return (
          <input
            type="number"
            value={typeof value === "string" ? value : ""}
            onChange={(event) =>
              handleTextChange(question.id, event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
          />
        );

      case "EMAIL":
        return (
          <input
            type="email"
            value={typeof value === "string" ? value : ""}
            onChange={(event) =>
              handleTextChange(question.id, event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
          />
        );

      case "DATE":
        return (
          <input
            type="date"
            value={typeof value === "string" ? value : ""}
            onChange={(event) =>
              handleTextChange(question.id, event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
          />
        );

      case "MULTIPLE_CHOICE":
        return (
          <div className="space-y-3">
            {getOptions(question.options).map((option, index) => (
              <label
                key={`${question.id}-${option}-${index}`}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={() => handleTextChange(question.id, option)}
                  className="h-4 w-4 accent-pink-600"
                />

                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case "CHECKBOX":
        return (
          <div className="space-y-3">
            {getOptions(question.options).map((option, index) => {
              const selectedOptions = Array.isArray(value) ? value : [];

              return (
                <label
                  key={`${question.id}-${option}-${index}`}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={(event) =>
                      handleCheckboxChange(
                        question.id,
                        option,
                        event.target.checked,
                      )
                    }
                    className="h-4 w-4 accent-pink-600"
                  />

                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case "DROPDOWN":
        return (
          <select
            value={typeof value === "string" ? value : ""}
            onChange={(event) =>
              handleTextChange(question.id, event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
          >
            <option value="">Select an option</option>

            {getOptions(question.options).map((option, index) => (
              <option key={`${question.id}-${option}-${index}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
    }
  }

  return (
    <form className="mt-8 space-y-6">
      {form.questions.map((question) => (
        <div
          key={question.id}
          className="rounded-xl border border-gray-200 p-5"
        >
          <label className="mb-3 block text-sm font-medium text-gray-900">
            {question.title}

            {question.required && <span className="ml-1 text-red-500">*</span>}
          </label>

          {renderQuestion(question)}
        </div>
      ))}

      <button
        type="submit"
        className="w-full rounded-lg bg-pink-600 px-5 py-3 font-medium text-white transition hover:bg-pink-700 active:scale-[0.98]"
      >
        Submit
      </button>
    </form>
  );
}

function getOptions(options: Question["options"]): string[] {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.filter(
    (option): option is string => typeof option === "string",
  );
}
