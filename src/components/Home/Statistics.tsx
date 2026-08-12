export default function Statistics() {
  const statistics = [
    {
      title:"10K+",
      description:"Forms Created",
    },
    {
      title:"50K+",
      description:"Responses Collected",
    },
    {
      title:"99.9%",
      description:"Uptime Guarantee",
    },
    {
      title:"4.5/5",
      description:"Average User Rating",
    }
  ]
  return (
    <section
      id="statistics"
      className="mt-30 flex flex-col items-center justify-center gap-4">
        <div className="pointer-events-none absolute left-150  top-340 h-40 w-40 rounded-full bg-pink-400/30 blur-3xl" />


        <div className=" relative z-10 flex flex-col items-center justify-center gap-4">
          <p className="text-pink-600 border-b border-pink-600 font-semibold">STATISTICS</p>
          <h1 className="text-5xl text-black font-extrabold">Built for better forms</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
          {statistics.map((statistic, index)=>(
            <div key={index} className="flex flex-col items-center p-8 bg-linear-to-br from-pink-300/30 to-pink-500/50 rounded-2xl hover:scale-105 transform transition-transform duration-300 shadow-md hover:shadow-lg hover:shadow-pink-600/30">
              <h2 className="text-4xl text-pink-600 font-extrabold">{statistic.title}</h2>
              <p className="text-gray-600">{statistic.description}</p>
            </div>
          ))}
        </div>
      </section>
  )
}
