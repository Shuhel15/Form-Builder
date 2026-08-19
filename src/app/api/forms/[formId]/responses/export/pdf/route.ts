import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

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
      return new Response("Unauthorized", {
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
      return new Response("Form not found", {
        status: 404,
      });
    }

    if (form.userId !== session.user.id) {
      return new Response("Forbidden", {
        status: 403,
      });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);
    });

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(form.title);

    if (form.description) {
      doc
        .moveDown(0.5)
        .fontSize(10)
        .font("Helvetica")
        .text(form.description);
    }

    doc
      .moveDown()
      .fontSize(11)
      .text(`Total Responses: ${form.submissions.length}`);

    doc.moveDown();

    form.submissions.forEach((submission, index) => {
      if (index > 0) {
        doc.addPage();
      }

      const answers = submission.answers as Record<string, unknown>;

      doc
        .fontSize(15)
        .font("Helvetica-Bold")
        .text(`Response ${index + 1}`);

      doc
        .moveDown(0.3)
        .fontSize(9)
        .font("Helvetica")
        .fillColor("gray")
        .text(
          `Submitted: ${submission.createdAt.toLocaleString()}`
        );

      doc.fillColor("black").moveDown();

      for (const question of form.questions) {
        const answer = answers[question.id];

        let answerText = "";

        if (Array.isArray(answer)) {
          answerText = answer.join(", ");
        } else if (
          answer !== null &&
          answer !== undefined
        ) {
          answerText = String(answer);
        }

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(question.title);

        doc
          .moveDown(0.2)
          .fontSize(10)
          .font("Helvetica")
          .text(answerText || "No answer");

        doc.moveDown(0.7);
      }
    });

    doc.end();

    const buffer = await pdfPromise;

    const filename = form.title
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}_responses.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);

    return new Response("Failed to export responses", {
      status: 500,
    });
  }
}