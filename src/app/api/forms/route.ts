import z from "zod";
import {auth} from "../../../lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const createFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
})
export async function POST(request:Request){
  try{

    //Check Authantication
    const session = await auth();
    if(!session?.user?.id)  return NextResponse.json({error:"Unauthorized"},{status:401})

    //checking if the data is valid or not
    const body = await request.json();
    const result = createFormSchema.safeParse(body);

    if(!result.success) return NextResponse.json({error:result.error.issues[0].message},{status:400})

          // It creates a url throught title and timestamp to make it unique and user friendly
    const slug = `${result.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now()}`;

      const form = await prisma.form.create({
        data:{
          title:result.data.title,
          description:result.data.description,
          slug,
          userId:session.user.id
        }
      })

      return NextResponse.json({success:true, formId:form.id})
    
  }catch(error){
    console.error("Error creating form:", error);
    return NextResponse.json({error:"Somthing went wrong please try again later"},
    {status:500})
  }
}