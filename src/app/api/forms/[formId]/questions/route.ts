import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const createQuestionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Question title is required")
    .max(500, "Question title is too long"),

  type: z.enum([
    "SHORT_TEXT",
    "LONG_TEXT",
    "MULTIPLE_CHOICE",
    "CHECKBOX",
    "DROPDOWN",
    "NUMBER",
    "EMAIL",
    "DATE",
  ]),

  required: z.boolean().default(false),
});

type RouteContext = {
  params: Promise<{
    formId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    // Authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { formId } = await params;

    // Request body
    const body: unknown = await request.json();

    // Validation
    const result = createQuestionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid question data",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { title, type, required } = result.data;

    // Check form + owner
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 },
      );
    }

    if (form.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    // Find next question order
    const lastQuestion = await prisma.question.findFirst({
      where: {
        formId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const nextOrder = lastQuestion
      ? lastQuestion.order + 1
      : 0;

    // Create question
    const question = await prisma.question.create({
      data: {
        formId,
        title,
        type,
        required,
        order: nextOrder,
            },
    });

    return NextResponse.json(
      {
        message: "Question created successfully",
        question,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create question error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}