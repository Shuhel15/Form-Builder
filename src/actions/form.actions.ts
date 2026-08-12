import {auth} from "../lib/auth";
import prisma from "../lib/prisma";
import { z} from "zod";

const formSchema = z.object({
  title:z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description:z.string().trim().max(200, "Description must be 200 characters").optional(),
})

export async function createForm(
  title:string,
  description:string,
){
  const session = await auth()

  if(!session?.user?.id){
    return{
      success:false,
      message:"Unauthorized"
    }
  }

  const result = formSchema.safeParse({title, description:description|| null})

  if(!result.success){
    return{
      success:false,
      message:result.error.issues[0]?.message ?? "Invalid data"
    }
  }

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
    return{
      success:true,
      formId:form.id,
      message:"Form created successfully"
    }
}