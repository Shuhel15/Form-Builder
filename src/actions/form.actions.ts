"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Form title is required")
    .max(100, "Form title is too long"),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional(),
});

export async function createForm(
  title: string,
  description: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const result = createFormSchema.safeParse({
    title,
    description: description || undefined,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  const slug = `${result.data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now()}`;

  const form = await prisma.form.create({
    data: {
      title: result.data.title,
      description: result.data.description || null,
      slug,
      userId: session.user.id,
    },
  });

  return {
    success: true,
    formId: form.id,
  };
}