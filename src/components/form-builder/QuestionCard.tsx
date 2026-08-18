"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Question } from "@prisma/client";
import { useState } from "react";
import QuestionEditor from "./QuestionEditor";
import { useRouter } from "next/navigation";
import FadeIn from "../animations/FadeIn";


type QuestionCardProps = {
  question: Question;
  index: number;
};

export default function QuestionCard({ question, index }: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (isEditing) {
    return (
      <QuestionEditor
        question={question}
        onCancelAction={() => setIsEditing(false)}
      />
    );
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);

    try{
      const response = await fetch(`/api/questions/${question.id}`, {
        method: "DELETE",
      })

      const data: {
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        console.error(data.error ?? "Failed to delete question");
        return;
      }
      router.refresh();
    }catch(error){
      console.error("Error deleting question:", error);
    }finally{
      setIsDeleting(false);
    }
  }
  return (
    <FadeIn>
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500">
            Question {index + 1}
          </p>

          <h3 className="mt-1 text-base font-medium text-gray-900">
            {question.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-gray-600">
              {question.type}
            </span>

            <span
              className={
                question.required
                  ? "font-medium text-pink-600"
                  : "text-gray-500"
              }
            >
              {question.required ? "Required" : "Optional"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-green-600 hover:text-green-600 active:scale-95"
            aria-label="Edit question"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg border p-2 transition border-red-500 bg-red-100 text-red-500 active:scale-95"
            aria-label="Delete question"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
    </FadeIn>
    
  );
}
