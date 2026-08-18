import FadeIn from "../animations/FadeIn";

export default function Statistics() {
  const statistics = [
    {
      title: "10K+",
      description: "Forms Created",
    },
    {
      title: "50K+",
      description: "Responses Collected",
    },
    {
      title: "99.9%",
      description: "Uptime Guarantee",
    },
    {
      title: "4.5/5",
      description: "Average User Rating",
    },
  ];
  return (
    <FadeIn>
    <section
      id="statistics"
      className="relative mt-30 flex flex-col items-center justify-center gap-4 px-4 md:px-6"
    >
      <div className="pointer-events-none absolute left-2/3 top-2/3 h-32 w-32 -translate-x-1/2 rounded-full bg-pink-500/50  blur-3xl" />
      <div className=" relative z-10 flex flex-col items-center justify-center gap-4">
        <p className="text-pink-600 border-b border-pink-600 font-semibold">
          STATISTICS
        </p>
        <h1 className=" text-center text-5xl text-black font-extrabold">
          Built for better forms
        </h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
        {statistics.map((statistic, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-8 bg-linear-to-br from-pink-300/30 to-pink-400/50 rounded-2xl hover:scale-105 transform transition-transform duration-300 shadow-md hover:shadow-lg hover:shadow-pink-600/30"
          >
            <h2 className="text-4xl text-pink-600 font-extrabold">
              {statistic.title}
            </h2>
            <p className="text-gray-600">{statistic.description}</p>
          </div>
        ))}
      </div>
    </section>
    </FadeIn>
  );
}
