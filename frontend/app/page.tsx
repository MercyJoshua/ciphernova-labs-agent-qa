import Header from "@/components/templates/xero/sections/header";
import Hero from "@/components/templates/xero/sections/hero";
import Brands from "@/components/templates/xero/sections/brands";
import Features from "@/components/templates/xero/sections/features";
import Showcase from "@/components/templates/xero/sections/showcase";
import HowItWorks from "@/components/templates/xero/sections/how-it-works";
import Metrics from "@/components/templates/xero/sections/metrics";
import Testimonials from "@/components/templates/xero/sections/testimonials";
import Pricing from "@/components/templates/xero/sections/pricing";
import FAQ from "@/components/templates/xero/sections/faq";
import CTA from "@/components/templates/xero/sections/cta";
import Footer from "@/components/templates/xero/sections/footer";

export default function PreFlightPage() {
  return (
    <>
      <Header />
      <Hero />
      <Brands />
      <Features />
      <Showcase />
      <HowItWorks />
      <Metrics />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
