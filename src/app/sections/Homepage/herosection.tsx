"use client";

import Navbar from "../header";
import React from "react";
import Image from "next/image";
import slide1 from "../../assets/images/Dress.png";
import slide2 from "../../assets/images/hair.png";
import slide3 from "../../assets/images/bag.png";

export default function HeroSection() {
  const images = [slide1, slide2, slide3];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section id="hero" className="py-10 h-[100vh] z-0 ">
      <div className="bg-[#A9968D] mx-20 h-[90vh] px-4 lg:px-8 rounded-4xl flex flex-col justify-between">
        <header>
          <Navbar />
        </header>
        <div id="heroText" className="flex flex-col lg:flex-row justify-between  px-4 lg:px-12 pb-16">         
          <div className="flex-1">
            <h1 className="text-4xl lg:text-9xl font-black mb-6 text-[#EBFFEE]">
              Tag It.<br></br>
              Share It. <br></br>
              Sell It.
            </h1>
            <p className="text-sm lg:text-lg mb-6 text-[#EBFFEE]">
              Sella helps you add your product name, price, and payment info
              directly onto your photo — ready for WhatsApp, Instagram, or
              TikTok.
            </p>
            <button className="h-12 px-6 xl:px-8 rounded-2xl font-semibold text-white border border-light-50 hover:bg-[black] hover:border-0 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm xl:text-base">
              Try it free Now
            </button>
          </div>

          <div className="flex-1">
            <div className="relative w-full aspect-[5/4] rounded-3xl overflow-visible">
              {images.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`Slide ${i + 1}`}
                  fill
                  className={`object-contain absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
                  priority={i === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}