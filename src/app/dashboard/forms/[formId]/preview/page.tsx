import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import FormPreview from "@/components/Form/FormPreview";

type PreviewPageProps = {
  params: Promise<{
    formId: string;
  }>;
};

export default async function PreviewPage({
  params,
}: PreviewPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
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
    },
  });

  if (!form) {
    notFound();
  }

  if (form.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <FormPreview form={form} />
      </div>
    </main>
  );
}