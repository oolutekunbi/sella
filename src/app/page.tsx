import Image from "next/image";
import HeroSection from "./sections/Homepage/herosection";

import "./globals.css";
import { Timeline } from "@/components/ui/timeline";
import How from "./sections/Homepage/how";
import BentoGrid from "./sections/Homepage/value";
import PricingComponent from "./sections/Homepage/price";
import Footer from "./sections/footer";
import { AnimatedTestimonialsDemo } from "./sections/Homepage/testimonial";




export default function Home() {
 
  return (
    <>
   
      <section>
        <HeroSection />
        <How />
  {/* <Timeline data={data} /> */}
  <BentoGrid />
  <AnimatedTestimonialsDemo></AnimatedTestimonialsDemo>
<PricingComponent />
      </section>
      <Footer />
    </>
  );
}
