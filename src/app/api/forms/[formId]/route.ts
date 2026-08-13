import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .nullable(),
});

type RouteContext = {
  params: Promise<{
    formId: string;
  }>;
};
export async function PATCH( request: Request, { params }: RouteContext) {
  try{
    const session = await auth();
    if(!session?.user?.id){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { formId } = await params;
    const body:unknown = await request.json();
    const result = updateFormSchema.safeParse(body);

    if(!result.success){
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { title, description } = result.data;

    const form = await prisma.form.findUnique({
      where:{
        id: formId,
      }, select:{
        id:true,
        userId:true,
      }

    })
    if(!form){
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if(form.userId !== session.user.id){
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedForm = await prisma.form.update({
      where:{
        id: formId,
      },
      data:{
        title,
        description: description || null,
      },
      select:{
        id:true,
        title:true,
        description:true,
      }
    })

    return NextResponse.json({
      message: "Form updated successfully",
      form: updatedForm,
    })

  }catch(error){
    console.error("Error updating form:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}