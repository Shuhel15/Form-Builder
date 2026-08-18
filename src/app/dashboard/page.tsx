import Link from "next/link";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { ChevronDown, ChevronRight } from "lucide-react";
import FormActions from "../../components/Form/FormAction";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const forms = await prisma.form.findMany({
    where: {
      userId: session.user.id,
    },
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
    take: 5,
  });

  const totalForms = await prisma.form.count({
    where: {
      userId: session.user.id,
    },
  });

  const publishedForms = await prisma.form.count({
    where: {
      userId: session.user.id,
      published: true,
    },
  });

  const totalResponses = await prisma.submission.count({
    where: {
      form: {
        userId: session.user.id,
      },
    },
  });

  return (
    <div className="mt-10 flex w-full flex-col">
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-6 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold md:text-4xl">
            Welcome back{" "}
            <span className="text-pink-600">{session.user.name}</span>
          </h1>

          <p className="text-sm text-zinc-500 md:text-xl">
            Create and manage your forms
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow-md shadow-pink-300/30 transition-all duration-300 hover:scale-105 hover:bg-pink-700 active:scale-95 md:px-5 md:py-3 md:text-base"
        >
          + Create Form
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-10 grid w-full grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-pink-600 px-6 py-3">
          <p className="text-sm text-zinc-500">Total Forms</p>

          <h2 className="mt-2 text-3xl font-bold">{totalForms}</h2>

          <Link
            href="/dashboard/forms"
            className="group mt-2 flex flex-row items-center justify-between gap-1 rounded-2xl border border-pink-400 bg-pink-300/30 px-2 py-0.5 text-xs text-pink-600 md:text-sm"
          >
            View Forms
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="rounded-xl border border-pink-600 px-6 py-3">
          <p className="text-sm text-zinc-500">Total Responses</p>

          <h2 className="mt-2 text-3xl font-bold">{totalResponses}</h2>

          <Link
            href="/dashboard/forms?filter=responses"
            className="group mt-2 flex flex-row items-center justify-between gap-1 rounded-2xl border border-pink-400 bg-pink-300/30 px-2 py-0.5 text-xs text-pink-600 md:text-sm"
          >
            View Responses
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="rounded-xl border border-pink-600 px-6 py-3">
          <p className="text-sm text-zinc-500">Published</p>

          <h2 className="mt-2 text-3xl font-bold">{publishedForms}</h2>

          <Link
            href="/dashboard/forms?filter=published"
            className="group mt-2 flex flex-row items-center justify-between gap-1 rounded-2xl border border-pink-400 bg-pink-300/30 px-2 py-0.5 text-xs text-pink-600 md:text-sm"
          >
            View Published
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Recent Forms */}
      <div className="mt-10 flex flex-col">
        <h1 className="text-2xl font-bold md:text-4xl">Recent Forms</h1>
      </div>

      {forms.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-8 text-center">
          <p className="text-sm text-zinc-500">
            You haven&apos;t created any forms yet.
          </p>

          <Link
            href="/create"
            className="mt-4 inline-block rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
          >
            Create your first form
          </Link>
        </div>
      ) : (
        forms.map((form) => (
          <div
            key={form.id}
            className="mt-4 flex flex-col gap-2 rounded-xl border border-zinc-200 p-4 shadow-md hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{form.title}</h2>

                <p className="text-sm text-zinc-500">
                  {form.description || "No description"}
                </p>
              </div>

              <div className="flex flex-row items-center gap-4">
                <p
                  className={`rounded-2xl px-2 text-sm text-white ${
                    form.published ? "bg-green-500" : "bg-zinc-400"
                  }`}
                >
                  {form.published ? "Published" : "Draft"}
                </p>

                <p className="text-sm text-zinc-500">
                  {form._count.submissions} responses
                </p>

                <FormActions
                  formId={form.id}
                  published={form.published}
                  slug={form.slug}
                />
              </div>
            </div>
          </div>
        ))
      )}

      <Link
        href="/dashboard/forms"
        className="group flex flex-row items-center justify-center gap-2 mt-6 self-center rounded-lg border border-pink-600 px-5 py-2.5 text-sm font-medium text-pink-600 transition hover:bg-pink-50 active:scale-95"
      >
        View All Forms{" "}
        <ChevronDown
          size={20}
          className="group-hover: transition-transform group-hover:translate-y-1"
        />
      </Link>
    </div>
  );
}
