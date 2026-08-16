import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {auth} from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    formId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try{
    const session = await auth();
    if(!session?.user?.id){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const { formId } = await context.params;

    const body: unknown = await request.json();
    //Check if the body has a published property and that it is a boolean
    if (
      typeof body !== "object" ||
      body === null ||
      !("published" in body) ||
      typeof body.published !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Invalid published value" },
        { status: 400 }
      );
    }

    const form = await prisma.form.findUnique({
      where:{
        id: formId,
        userId: session.user.id,
      }, 
      select:{
        id:true,
      }
    })
    
    if(!form){
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const updatedForm = await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        published: body.published,
      },
      select: {
        id: true,
        published: true,
        slug: true,
      },
    });

    return NextResponse.json({success: true, form: updatedForm}, { status: 200 });
    
  } catch (error) {
    console.error("Failed to update form publish state:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}