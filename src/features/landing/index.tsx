"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Banners from "./components/Banners";
import HomeSections from "./components/HomeSections";
import AboutSection from "./components/AboutSection";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Banners />
      <HomeSections />
      <AboutSection />
      <CTA />
      <Footer />
    </div>
  );
}
