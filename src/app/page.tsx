import CTA from "@/components/Home/CTA";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import HowToUse from "@/components/Home/HowToUse";
import Statistics from "@/components/Home/Statistics";
import WhyFormBuilder from "@/components/Home/WhyFormBuilder";

function page() {
  return (
<main >
      <Hero/>
      <Features />
      <WhyFormBuilder/>
      <Statistics />
      <HowToUse/>
      <CTA/>
      
</main>
  );
}

export default page;
