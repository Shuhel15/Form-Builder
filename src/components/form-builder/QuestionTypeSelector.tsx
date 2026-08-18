"use client";

import type { QuestionType } from "@prisma/client";
import FadeIn from "../animations/FadeIn";

type QuestionTypeSelectorProps = {
  value: QuestionType;
  onChangeAction: (value: QuestionType) => void;
};

const questionTypes: {
  value: QuestionType;
  label: string;
}[] = [
  {
    value: "SHORT_TEXT",
    label: "Short Text",
  },
  {
    value: "LONG_TEXT",
    label: "Long Text",
  },
  {
    value: "MULTIPLE_CHOICE",
    label: "Multiple Choice",
  },
  {
    value: "CHECKBOX",
    label: "Checkbox",
  },
  {
    value: "DROPDOWN",
    label: "Dropdown",
  },
  {
    value: "NUMBER",
    label: "Number",
  },
  {
    value: "EMAIL",
    label: "Email",
  },
  {
    value: "DATE",
    label: "Date",
  },
];

export default function QuestionTypeSelector({
  value,
  onChangeAction,
}: QuestionTypeSelectorProps) {
  return (
    <FadeIn>
    <div>
      <label
        htmlFor="question-type"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Question Type
      </label>

      <select
        id="question-type"
        value={value}
        onChange={(event) =>
          onChangeAction(event.target.value as QuestionType)
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
      >
        {questionTypes.map((questionType) => (
          <option
            key={questionType.value}
            value={questionType.value}
          >
            {questionType.label}
          </option>
        ))}
      </select>
    </div>
    </FadeIn>
  );
}