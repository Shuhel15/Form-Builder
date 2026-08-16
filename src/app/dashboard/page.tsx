import Link from "next/link";
import { auth } from "../../lib/auth";
import { ChevronRight } from "lucide-react";
import FormActions from "../../components/Form/FormAction";

export default async function Dashboard() {
  const session = await auth();

  const forms =[
    {
      title: "Form 1",
      description: "This is form 1",
      responses: 10,
      status: "Published"
    },
    {
      title: "Form 2",
      description: "This is form 2",
      responses: 10,
      status: "Published"
    },
    {
      title: "Form 3",
      description: "This is form 3",
      responses: 10,
      status: "Published"
    },
  ]

  return (
    <div className="mt-10 flex w-full flex-col">
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-6 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold md:text-4xl">
            Welcome back{" "}
            <span className="text-pink-600">{session?.user?.name}</span>
          </h1>

          <p className="text-sm text-zinc-500 md:text-xl">
            Create and manage your forms
          </p>
        </div>

        <Link
          href="/create"
          className="rounded-lg bg-pink-600 px-2.5 py-1.5 md:px-5 md:py-3 text-white hover:scale-105 shadow-md active:scale-95 shadow-pink-300/30 transition-all duration-300 hover:bg-pink-700 "
        >
          + Create Form
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-10 grid w-full grid-cols-2 gap-4 md:grid-cols-3">
        <div className=" rounded-xl border border-pink-600 px-6 py-3">
          <p className="text-sm text-zinc-500">Total Forms</p>
          <h2 className="mt-2 text-3xl font-bold">0</h2>
          <Link
            href="/forms"
            className="group mt-2 text-xs md:text-sm bg-pink-300/30 px-2 rounded-2xl py-0.5 border border-pink-400  text-pink-600 flex flex-row items-center justify-between gap-1 "
          >
            View Forms <ChevronRight size={16} className="group-hover:transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="rounded-xl border border-pink-600 px-6 py-3">
          <p className="text-sm text-zinc-500">Total Responses</p>
          <h2 className="mt-2 text-3xl font-bold">0</h2>
          <Link
            href="/forms"
            className="group mt-2 text-xs md:text-sm bg-pink-300/30 px-2 rounded-2xl py-0.5  border border-pink-400 text-pink-600 flex flex-row items-center justify-between gap-1 "
          >
            View Responses <ChevronRight size={16} className="group-hover:transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className=" rounded-xl border border-pink-600 px-6 py-3">
          <p className="text-sm text-zinc-500">Published</p>
          <h2 className="mt-2 text-3xl font-bold">0</h2>
          <Link
            href="/forms"
            className="group mt-2 text-xs md:text-sm bg-pink-300/30 px-2 rounded-2xl py-0.5  border border-pink-400 text-pink-600 flex flex-row items-center justify-between gap-1 "
          >
            View Published <ChevronRight size={16} className="group-hover:transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      {/* Recent forms */}
      <div className="flex flex-col mt-10">
        <h1 className="text-2xl md:text-4xl font-bold">Recent Forms</h1>
      </div>
      {forms.map((form, index) => (
        <div
          key={index}
          className="mt-4 flex flex-col gap-2 rounded-xl border border-zinc-200 p-4 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{form.title}</h2>
              <p className="text-sm text-zinc-500">{form.description}</p>
            </div>
            <div className="flex flex-row items-center gap-4">
            <p className="text-sm text-white bg-green-500 px-2 rounded-2xl">{form.status}</p>
            <p className="text-sm text-zinc-500">{form.responses} responses</p>
            <FormActions />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
