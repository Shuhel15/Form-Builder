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

export default function FormActions() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md p-1 hover:bg-zinc-100"
      >
        <EllipsisVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">
            <Pencil size={16} />
            Edit
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">
            <Eye size={16} />
            View
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">
            <MessageSquare size={16} />
            Responses
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">
            <Share2 size={16} />
            Share
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}