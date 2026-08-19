import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

type RouteContext = {
  params: Promise<{
    formId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
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
        submissions: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!form) {
      return new NextResponse("Form not found", {
        status: 404,
      });
    }

    if (form.userId !== session.user.id) {
      return new NextResponse("Forbidden", {
        status: 403,
      });
    }

    const rows = form.submissions.map((submission, index) => {
      const answers = submission.answers as Record<string, unknown>;

      const row: Record<string, string | number> = {
        "Response #": index + 1,
        "Submitted At": submission.createdAt.toLocaleString(),
      };

      for (const question of form.questions) {
        const answer = answers[question.id];

        if (Array.isArray(answer)) {
          row[question.title] = answer.join(", ");
        } else if (answer === null || answer === undefined) {
          row[question.title] = "";
        } else {
          row[question.title] = String(answer);
        }
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Responses"
    );

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${form.title.replace(
          /[^a-z0-9]/gi,
          "_"
        )}_responses.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);

    return new NextResponse("Failed to export responses", {
      status: 500,
    });
  }
}