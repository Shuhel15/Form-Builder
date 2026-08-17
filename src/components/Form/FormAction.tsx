"use client";

import { useEffect, useRef, useState } from "react";
import {
  EllipsisVertical,
  Pencil,
  Eye,
  MessageSquare,
  Share2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type FormActionsProps = {
  formId: string;
  published: boolean;
  slug: string;
};

export default function FormActions({
  formId,
  published,
  slug,
}: FormActionsProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  //Outside click handler to close the menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //For deleting a form
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this form?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      });

      const data: { error?: string } = await response.json();

      if (!response.ok) {
        alert(data.error ?? "Failed to delete form");
        return;
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Delete form error:", error);
      alert("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  }

  //For sharing a form
  async function handleShare() {
    const publicUrl = `${window.location.origin}/forms/${slug}`;

    try {
      await navigator.clipboard.writeText(publicUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy link error:", error);
      alert("Failed to copy link");
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md p-1 hover:bg-zinc-100"
        aria-label="Form actions"
      >
        <EllipsisVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              router.push(`/dashboard/forms/${formId}/edit`);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              router.push(`/dashboard/forms/${formId}/preview`);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100"
          >
            <Eye size={16} />
            View
          </button>

          <button
            type="button"
            onClick={() => {
              router.push(`/dashboard/forms/${formId}/responses`);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100"
          >
            <MessageSquare size={16} />
            Responses
          </button>

          {published && (
            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100"
            >
              <Share2 size={16} />
              {copied ? "Copied!" : "Share"}
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}