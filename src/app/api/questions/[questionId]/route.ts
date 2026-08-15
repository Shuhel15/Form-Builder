import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const updateQuestionSchema = z.object({
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

  required: z.boolean(),
});

type RouteContext = {
  params: Promise<{
    questionId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { questionId } = await params;

    const body: unknown = await request.json();

    const result = updateQuestionSchema.safeParse(body);

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

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        form: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    // Check question's form owner
    if (question.form.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const updatedQuestion = await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        title,
        type,
        required,
      },
    });

    return NextResponse.json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Update question error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}


// deleting a question
export async function DELETE(
  request: Request,
  {params}: RouteContext,
){
  try{
    const session = await auth();

    if(!session?.user?.id){
      return NextResponse.json({
        error:"Unauthorized"
      },{status:401
      })
    }

    const {questionId} = await params;

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        form: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    if (question.form.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json({
      message: "Question deleted successfully",
      questionId,
    });
  } catch (error) {
    console.error("Delete question error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}