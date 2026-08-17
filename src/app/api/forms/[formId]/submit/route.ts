import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const submitResponseSchema = z.object({
  answers: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string())]),
  ),
});

type RouteContext = {
  params: Promise<{
    formId: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const { formId } = await context.params;

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
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 },
      );
    }

    const body: unknown = await request.json();

    const result = submitResponseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid submission data" },
        { status: 400 },
      );
    }

    const { answers } = result.data;

    for (const question of form.questions) {
      const answer = answers[question.id];

      // Required validation
      if (question.required) {
        const isEmpty =
          answer === undefined ||
          answer === "" ||
          (Array.isArray(answer) && answer.length === 0);

        if (isEmpty) {
          return NextResponse.json(
            {
              error: `"${question.title}" is required`,
            },
            { status: 400 },
          );
        }
      }

      // Skip validation if optional question has no answer
      if (answer === undefined || answer === "") {
        continue;
      }

      // Email validation
      if (question.type === "EMAIL") {
        if (typeof answer !== "string") {
          return NextResponse.json(
            {
              error: `"${question.title}" must be a valid email`,
            },
            { status: 400 },
          );
        }

        const emailSchema = z.string().email();

        if (!emailSchema.safeParse(answer).success) {
          return NextResponse.json(
            {
              error: `"${question.title}" must be a valid email`,
            },
            { status: 400 },
          );
        }
      }

      // Number validation
      if (question.type === "NUMBER") {
        if (typeof answer !== "string" || answer.trim() === "") {
          return NextResponse.json(
            {
              error: `"${question.title}" must be a number`,
            },
            { status: 400 },
          );
        }

        const number = Number(answer);

        if (!Number.isFinite(number)) {
          return NextResponse.json(
            {
              error: `"${question.title}" must be a number`,
            },
            { status: 400 },
          );
        }
      }

      // Choice validation
      if (
        question.type === "MULTIPLE_CHOICE" ||
        question.type === "DROPDOWN"
      ) {
        if (typeof answer !== "string") {
          return NextResponse.json(
            {
              error: `Invalid answer for "${question.title}"`,
            },
            { status: 400 },
          );
        }

        const options = getOptions(question.options);

        if (!options.includes(answer)) {
          return NextResponse.json(
            {
              error: `Invalid option for "${question.title}"`,
            },
            { status: 400 },
          );
        }
      }

      // Checkbox validation
      if (question.type === "CHECKBOX") {
        if (!Array.isArray(answer)) {
          return NextResponse.json(
            {
              error: `Invalid answer for "${question.title}"`,
            },
            { status: 400 },
          );
        }

        const options = getOptions(question.options);

        const allOptionsValid = answer.every((item) =>
          options.includes(item),
        );

        if (!allOptionsValid) {
          return NextResponse.json(
            {
              error: `Invalid option for "${question.title}"`,
            },
            { status: 400 },
          );
        }
      }
    }

    // Reject answers belonging to unknown questions
    const questionIds = new Set(
      form.questions.map((question) => question.id),
    );

    for (const questionId of Object.keys(answers)) {
      if (!questionIds.has(questionId)) {
        return NextResponse.json(
          { error: "Invalid question ID in submission" },
          { status: 400 },
        );
      }
    }

    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        answers,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        submission,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Submit response error:", error);

    return NextResponse.json(
      { error: "Failed to submit response" },
      { status: 500 },
    );
  }
}

function getOptions(options: unknown): string[] {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.filter(
    (option): option is string => typeof option === "string",
  );
}