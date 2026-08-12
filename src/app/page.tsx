import CTA from "@/components/Home/CTA";
import Features from "@/components/Home/Features";
import Home from "@/components/Home/Home";
import HowToUse from "@/components/Home/HowToUse";
import Statistics from "@/components/Home/Statistics";

function page() {
  return (
    <>
      <Home />
      <Features />
      <Statistics />
      <HowToUse/>
      <CTA/>
      
    </>
  );
}

export default page;
