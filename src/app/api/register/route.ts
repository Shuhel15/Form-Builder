import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          message: result.error.issues[0].message,
        }),
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "User already exists. Please login instead.",
        }),
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (result.success) {
      return new Response(
        JSON.stringify({
          message: "User registered successfully",
          user,
        }),
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return Response.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
