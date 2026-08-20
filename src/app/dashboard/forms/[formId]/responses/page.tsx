import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ResponseExportButtons from "@/components/form-builder/ResponseExportButtons";

type ResponsesPageProps = {
  params: Promise<{
    formId: string;
  }>;
};

export default async function ResponsesPage({ params }: ResponsesPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const { formId } = await params;

  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
      submissions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!form) {
    notFound();
  }

  if (form.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>

          {form.description && (
            <p className="mt-2 text-gray-600">{form.description}</p>
          )}
        </div>

        <ResponseExportButtons
          formId={formId}
          disabled={form.submissions.length === 0}
        />
      </div>

      {/* Response Summary */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm font-medium text-gray-500">Total Responses</p>

        <p className="mt-2 text-3xl font-bold text-pink-600">
          {form.submissions.length}
        </p>
      </div>

      {/* Empty State */}
      {form.submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No responses yet.
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Responses will appear here when someone submits your form.
          </p>
        </div>
      ) : (
        /* Response List */
        <div className="space-y-4">
          {form.submissions.map((submission, index) => (
            <div
              key={submission.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Response <span className="text-pink-600">{index + 1}</span>
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Submitted: {submission.createdAt.toLocaleString()}
                  </p>
                </div>

                <Link
                  href={`/dashboard/forms/${formId}/responses/${submission.id}`}
                  className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700 active:scale-95"
                >
                  View Response
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
