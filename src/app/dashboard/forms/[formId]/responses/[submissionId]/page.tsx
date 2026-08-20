import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type ResponsePageProps = {
  params: Promise<{
    formId: string;
    submissionId: string;
  }>;
};

export default async function IndividualResponsePage({
  params,
}: ResponsePageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound()
  }

  const { formId, submissionId } = await params;

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

  const submission = await prisma.submission.findFirst({
    where: {
      id: submissionId,
      formId,
    },
  });

  if (!submission) {
    notFound();
  }

  const answers = submission.answers as Record<string, unknown>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {form.title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Submitted: {submission.createdAt.toLocaleString()}
        </p>
      </div>

      {/* Ques and ans */}
      <div className="space-y-5">
        {form.questions.map((question, index) => {
          const answer = answers[question.id];

          return (
            <div
              key={question.id}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <p className="text-sm font-medium text-gray-500">
                Question {index + 1}
              </p>

              <h2 className="mt-2 text-base font-semibold text-gray-900">
                {question.title}
              </h2>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">
                  Answer
                </p>

                <div className="mt-2 rounded-lg bg-gray-50 p-4 text-gray-900">
                  {Array.isArray(answer) ? (
                    <ul className="space-y-1">
                      {answer.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {String(item)}
                        </li>
                      ))}
                    </ul>
                  ) : answer === null || answer === undefined || answer === "" ? (
                    <span className="text-gray-400">
                      No answer
                    </span>
                  ) : (
                    String(answer)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}