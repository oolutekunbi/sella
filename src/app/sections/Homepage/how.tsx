

export default function How() {

  const steps = [
    {
      number: "01",
      title: "Upload your product photo",
      description: "Take a quick shot or choose one from your gallery. No design skills needed.",
      gradient: "from-[#9B4A2C] via-[#9B4A2C] to-[#9B4A2C]"
    },
    {
      number: "02", 
      title: "Add your price and details",
      description: "Input the product name, price, and preferred payment method.",
      gradient: "from-[#9B4A2C] via-[#9B4A2C] to-[#9B4A2C]"
    },
    {
      number: "03",
      title: "Download and share",
      description: "Your tagged product photo is ready to post on WhatsApp, Instagram, TikTok, or anywhere your customers are.",
      gradient: "from-[#9B4A2C] via-[#9B4A2C] to-[#9B4A2C]"
    }
  ];

    return (
        <div className="py-10 container max-w-7xl lg:px-8 flex flex-col items-center">
            <div className="max-w-4xl w-full px-4 text-center">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">How it works</h2>
                <p className="text-neutral-700 text-sm md:text-base max-w-2xl mx-auto mb-12">
                    Sella is designed to be simple and fast — no design skills or technical experience needed. In just a few steps, your product is ready to be sold online.
                </p>
            </div>
            <div className="w-full bg-white">
     

      {/* Steps Container */}
      <div className="relative">
        {/* Progress Line - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block absolute top-40 left-0 right-0 h-0.5 bg-[#9B4A2C]"></div>
        <div className="hidden md:block absolute top-40 left-0 w-2/3 h-0.5 bg-[#9B4A2C]"></div>

        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative p-8 md:p-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
            
              {/* Step Number */}
              <div className="mb-1 lg:mb-8">
            
                <div className={`text-8xl md:text-9xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent inline-block`}>
                  {step.number}
                </div>

                <div className="hidden md:block  absolute top-[120px] left-0 w-4 h-4 bg-[#9B4A2C] rounded-full z-10 sm:hidden"></div>

              
                
              </div>

              {/* Step Content */}
              <div className="lg:pt-8">
                <h3 className="text-xl md:text-2xl font-bold tracking-tighter text-gray-900 lg:mb-4 lg:mb:0">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

       
      </div>

     
    </div>


        
        </div>
    );
}