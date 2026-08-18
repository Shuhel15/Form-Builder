import { BookText, ChartNoAxesCombined, CopyPlus, Share2 } from "lucide-react";

export default function HowToUse() {
  const steps = [
    {
      icon: <BookText />,
      title: "Step 1: Create a Form",
      description: "Start by creating a new form. For your work",
    },
    {
      icon: <CopyPlus />,
      title: "Step 2: Add Questions",
      description: "Add questions to your form using the form builder.",
    },
    {
      icon: <Share2 />,
      title: "Step 3: Share Your Form",
      description: "Share your form with others to collect responses.",
    },
    {
      icon: <ChartNoAxesCombined />,
      title: "Step 4: View Responses",
      description: "View and analyze the responses you receive.",
    },
  ];
  return (
    <section
      id="how-to-use"
      className=" relative mt-30 flex flex-col items-center justify-center gap-4 px-4 md:px-6"
    >
      <div className="pointer-events-none absolute md:right-2/3 top-2/3 h-32 w-32 -translate-x-1/2 rounded-full bg-pink-400/40  blur-3xl" />
      <div className="flex relative z-10 flex-col items-center justify-center gap-2">
        <p className="text-lg text-pink-600 font-semibold border-b border-pink-600">
          HOW TO USE
        </p>
        <h1 className="text-5xl text-black font-extrabold text-center">
          How to use form builder?
        </h1>
      </div>
      <div
        id="how-to-use"
        className="mt-10 grid w-full grid-cols-1 items-stretch gap-8 md:grid-cols-4"
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex h-full min-h-48 flex-col gap-4 rounded-2xl border border-pink-600 p-6 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-600/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center w-10 h-10  border rounded-lg bg-pink-300/30 border-pink-600 text-pink-600 shadow-md hover:shadow-lg transition-shadow duration-300">
                {step.icon}
              </div>
              <h1 className="text-lg font-semibold text-black">{step.title}</h1>
            </div>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
