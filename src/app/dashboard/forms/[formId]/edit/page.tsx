import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import FormBuilder from "@/components/form-builder/FormBuilder";

type EditFormPageProps = {
  params: Promise<{
    formId: string;
  }>;
};

export default async function EditFormPage({
  params,
}: EditFormPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { formId } = await params;

  // Fetching form data from the database
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
    },
  });


  if (!form) {
    notFound();
  }

  if (form.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="min-h-screen mt-10 rounded-2xl bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-4xl px-4">
        <FormBuilder form={form} />
      </div>
    </main>
  );
}