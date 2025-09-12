import React from 'react';
import slide1 from "../../assets/images/Dress.png";
import slide2 from "../../assets/images/iphone 15.png";
import slide3 from "../../assets/images/Group 39.png";
import Image from "next/image";


const BentoGrid = () => {
  return (

    <div className="py-10 w-full flex flex-col items-center">
    <div className="max-w-4xl w-full px-2 text-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Built for Ghanaian Sellers</h2>
        <p className="text-neutral-700 text-sm md:text-base max-w-2xl mx-auto mb-12">
        Whether you sell wigs, meals, beauty products, or secondhand clothes, Sella helps you:
        </p>


    

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Top Left Card - Streamline Procurement */}
          <div className="bg-[#A9968D] rounded-3xl p-8 flex flex-col justify-evenly items-center min-h-[300px] transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {/* Phone Mockup */}
            <Image src={slide1} alt="" 
     
     className="object-contain w-[30%] h-[40%] items-center align-middle flex justify-center"

     />
            
            {/* Content */}
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter  mb-4">
              Look Professional
              </h2>
              <p className="text-lg opacity-90 max-w-md mx-auto">
              Sella helps you present your products beautifully with clean, modern visuals — no need to hire a designer or use complicated apps.              </p>
            </div>
          </div>

          {/* Top Right Card - Manage Projects */}
          <div className="bg-[#A9968D] rounded-3xl p-8 flex flex-col justify-evenly items-center min-h-[300px] transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="text-center text-white mb-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
              Show Prices Clearly
              </h2>
              <p className="text-lg opacity-90 max-w-md mx-auto mb-8">
              Buyers won’t need to ask, “How much?” — your price is clearly tagged on your product image, reducing back-and-forth chats.              </p>
            </div>
            <Image src={slide3} alt="" 
     
     className="object-contain w-[60%] h-[50%] items-center align-middle flex justify-center"

     />
            
            
          
          </div>

          {/* Bottom Full Width Card - Track and Control */}
          <div className="lg:col-span-2 bg-[#A9968D] rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-evenly min-h-[400px] transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {/* Left Content */}
            <div className="lg:w-1/2 text-white mb-8 lg:mb-0">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
              Accept Payment Your Way              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-md">
              Choose how you want to get paid: mobile money (MoMo), cash on delivery, or direct pickup. Sella lets you display your preferred method right on the image.              </p>
              
           
            </div>

            

            {/* Right Phone Mockup */}
            <div className="w-[100%] h-auto lg:w-1/2 flex justify-center">

           <Image src={slide2} alt="" 
     
           className="object-cover  w-[40%] h-[100%] lg:w-[40%] lg:h-[20%]"

           />
            
          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;