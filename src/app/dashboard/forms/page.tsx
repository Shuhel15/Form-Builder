import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChevronRight } from "lucide-react";
import FormActions from "@/components/Form/FormAction";

type FormsPageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

export default async function FormsPage({ searchParams }: FormsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const { filter } = await searchParams;

  const where = {
    userId: session.user.id,
    ...(filter === "responses"
      ? {
          submissions: {
            some: {},
          },
        }
      : {}),
    ...(filter === "published"
      ? {
          published: true,
        }
      : {}),
  };

  const forms = await prisma.form.findMany({
    where,
    include: {
      _count: {
        select: {
          submissions: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const pageTitle =
    filter === "responses"
      ? "Forms with Responses"
      : filter === "published"
        ? "Published Forms"
        : "My Forms";

  return (
    <div className="mt-10 flex w-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-4xl">{pageTitle}</h1>

          <p className="mt-1 text-sm text-zinc-500 md:text-base">
            Create and manage your forms
          </p>
        </div>

        <Link
          href="/create"
          className="w-fit rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-pink-300/30 transition hover:bg-pink-700 active:scale-95"
        >
          + Create Form
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/dashboard/forms"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            !filter
              ? "border-pink-600 bg-pink-600 text-white"
              : "border-zinc-200 text-zinc-600 hover:border-pink-600 hover:text-pink-600"
          }`}
        >
          All Forms
        </Link>

        <Link
          href="/dashboard/forms?filter=responses"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            filter === "responses"
              ? "border-pink-600 bg-pink-600 text-white"
              : "border-zinc-200 text-zinc-600 hover:border-pink-600 hover:text-pink-600"
          }`}
        >
          With Responses
        </Link>

        <Link
          href="/dashboard/forms?filter=published"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            filter === "published"
              ? "border-pink-600 bg-pink-600 text-white"
              : "border-zinc-200 text-zinc-600 hover:border-pink-600 hover:text-pink-600"
          }`}
        >
          Published
        </Link>
      </div>

      {/* Forms */}
      {forms.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 p-10 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">
            No forms found
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {filter === "responses"
              ? "No forms have received responses yet."
              : filter === "published"
                ? "You don't have any published forms yet."
                : "You haven't created any forms yet."}
          </p>

          {!filter && (
            <Link
              href="/create"
              className="mt-5 inline-block rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
            >
              Create your first form
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="rounded-xl border border-zinc-200 p-4 shadow-sm transition hover:shadow-md"
            >
              {/* Form Info + Top Right Menu */}
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="min-w-0 truncate text-lg font-semibold text-zinc-900">
                    {form.title}
                  </h2>

                  {/* Three dot menu */}
                  <div className="shrink-0">
                    <FormActions
                      formId={form.id}
                      published={form.published}
                      slug={form.slug}
                    />
                  </div>
                </div>

                <p className="mt-1 text-sm text-zinc-500">
                  {form.description || "No description"}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-2xl px-2.5 py-1 text-xs font-medium text-white ${
                      form.published ? "bg-green-500" : "bg-zinc-400"
                    }`}
                  >
                    {form.published ? "Published" : "Draft"}
                  </span>

                  <span className="text-sm text-zinc-500">
                    {form._count.submissions} responses
                  </span>
                </div>

                {/* Responses */}
                {form._count.submissions > 0 && (
                  <div className="mt-4">
                    <Link
                      href={`/dashboard/forms/${form.id}/responses`}
                      className="group inline-flex items-center gap-1 rounded-lg border border-pink-600 px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-50"
                    >
                      Responses
                      <ChevronRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}