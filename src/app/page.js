import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import Demo from "../../components/Demo/Demo";
import WhyChoose from "../../components/WhyChoose/WhyChoose";
import WhatYouCanDo from "../../components/WhatYouCanDo/WhatYouCanDo";
import Testimonials from "../../components/Testimonials/Testimonials";
import Pricing from "../../components/Pricing/Pricing";
import FAQ from "../../components/FAQ/FAQ";
import Footer from "../../components/Footer/Footer";

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Demo />
      <WhyChoose />
      <WhatYouCanDo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default page;
