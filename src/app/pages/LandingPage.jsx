"use client";
import React from "react";
import { Weight } from "lucide-react";
import Header from "./landing/Header";
import Hero from "./landing/Hero";
import VideoSection from "./landing/VideoSection";
import Features from "./landing/Features";
import Testimonials from "./landing/Testimonials";
import Footer from "./landing/Footer";

const LandingPage = () => {

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <VideoSection />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
