import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { HowItWorks } from "@/components/landing/how-it-works";
import { VexAI } from "@/components/landing/vex-ai";
import { LaunchOffer } from "@/components/landing/launch-offer";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <VexAI />
        <LaunchOffer />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
