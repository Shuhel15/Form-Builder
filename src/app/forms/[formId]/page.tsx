import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PublicForm from "@/components/Form/PublicForm";

type PublicFormPageProps = {
  params: Promise<{
    formId: string;
  }>;
};

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const { formId } = await params;

  const form = await prisma.form.findFirst({
    where: {
      id: formId,
      published: true,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!form) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>

            {form.description && (
              <p className="mt-3 text-gray-600">{form.description}</p>
            )}
          </div>

          <PublicForm form={form} />
        </div>
      </div>
    </main>
  );
}
