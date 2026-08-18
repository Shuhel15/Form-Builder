import { MoveRight } from "lucide-react";
import {auth} from "../../lib/auth"
import FadeIn from "../animations/FadeIn";
export default async function CTA() {

  const session = await auth();
  return (
    <FadeIn>
    <div className="mt-30 flex flex-col items-center justify-center gap-4 text-center shadow-xl shaodow-pink-600/30 rounded-xl bg-pink-600 text-white p-8">
      <h1 className="text-3xl md:text-5xl font-extrabold">Ready to build your next form?</h1>
      <p className="text-lg md:text-xl">
        Start building your form today with our easy-to-use form builder.
      </p>
      <a
        href={session?.user ? "/dashboard" : "/login"}
        className="group rounded-lg flex flex-row justify-center items-center gap-2 bg-white px-6 py-3 text-lg font-semibold text-pink-600  hover:bg-pink-100
        hover:scale-105 active:scale-95 duration-300 ease-in-out  transition-all"
      >
        Get Started <MoveRight className="group-hover:transition-transform group-hover:translate-x-1" />
      </a>
    </div>
    </FadeIn>
  )
}
