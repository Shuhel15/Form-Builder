"use client";

import { FileSpreadsheet, FileText } from "lucide-react";

type ResponseExportButtonsProps = {
  formId: string;
  disabled?: boolean;
};

export default function ResponseExportButtons({
  formId,
  disabled = false,
}: ResponseExportButtonsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <a
        href={`/api/forms/${formId}/responses/export/excel`}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 active:scale-95 ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Download Excel
      </a>

      <a
        href={`/api/forms/${formId}/responses/export/pdf`}
        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700 active:scale-95 ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <FileText className="h-4 w-4" />
        Download PDF
      </a>
    </div>
  );
}