import {
  MonitorSmartphone,
  Radio,
  SquareStack,
  TimerReset,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Build in Seconds",
      description:
        "You can create professional-looking forms in just a few clicks. No coding required!",
      icons: <TimerReset />,
    },
    {
      title: "Multiple Question Types",
      description:
        "Choose from a variety of question types, including multiple choice, text input, and more.",
      icons: <SquareStack />,
    },
    {
      title: "Real-Time Responses",
      description:
        "Get instant feedback on your forms with real-time response tracking.",
      icons: <Radio />,
    },
    {
      title: "Mobile Friendly",
      description:
        "Our forms are optimized for mobile devices, so you can create and respond to forms on the go.",
      icons: <MonitorSmartphone />,
    },
  ];
  return (
    <section
      id="features"
      className="relative mt-30 flex w-full flex-col items-center justify-center gap-4 px-4 md:px-6"
    >
      <div className="pointer-events-none absolute left-50 md:top-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-pink-400/30 blur-3xl" />

      <div className="pointer-events-none absolute md:right-50 md:top-1/5 h-32 w-32 translate-x-1/2 rounded-full bg-pink-400/30 blur-3xl" />
      <div className="flex relative z-10 flex-col items-center justify-center gap-2">
        <p className="text-lg text-pink-600 font-semibold border-b border-pink-600">
          FEATURES
        </p>
        <h1 className="text-5xl text-black font-extrabold text-center">
         Features of form builder ?
        </h1>
      </div>
      <div className="mt-10 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex relative z-10 flex-col gap-4 p-6 border border-pink-600 rounded-2xl shadow-md hover:shadow-lg
            hover:scale-105 transform transition-transform duration-300 hover:shadow-pink-600/30"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 shrink-0 border rounded-lg bg-pink-300/30 border-pink-600 text-pink-600
              shadow-md shadow-pink-300/30 hover:shadow-lg transition-shadow duration-300"
              >
                {feature.icons}
              </div>

              <h2 className="text-xl font-semibold">{feature.title}</h2>
            </div>

            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
