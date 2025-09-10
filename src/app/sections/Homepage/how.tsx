

export default function How() {

  const steps = [
    {
      number: "01",
      title: "Schedule a meeting",
      description: "You schedule a meeting with our product development team at a time that works for you",
      gradient: "from-[#9B4A2C] via-[#9B4A2C] to-[#9B4A2C]"
    },
    {
      number: "02", 
      title: "Meet Applabtech",
      description: "You share your product ideas and visions you have after we sign an NDA",
      gradient: "from-[#9B4A2C] via-[#9B4A2C] to-[#9B4A2C]"
    },
    {
      number: "03",
      title: "Obtain a strategy",
      description: "We outline how we can assist you in developing and bringing your product idea to life",
      gradient: "from-[#9B4A2C] via-[#9B4A2C] to-[#9B4A2C]"
    }
  ];

    return (
        <div className="py-10 container max-w-7xl lg:px-8 mx-auto align-middle items-center flex flex-col">
            <h2 className="text-7xl font-bold tracking-tight mb-6">How it works</h2>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm text-center">
                I&apos;ve been working on Aceternity for the past 2 years. Here&apos;s
                a timeline of my journey.
              </p>

              <div className="items-center align-center mx-auto px-4 py-16 bg-white">
     

      {/* Steps Container */}
      <div className="relative" >
        {/* Progress Line */}
        <div className="absolute top-40 left-0 right-0 h-0.5 bg-[#9B4A2C]"></div>
        <div className="absolute top-40 left-0 w-2/3 h-0.5 bg-[#9B4A2C]"></div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Progress Dot */}
              <div className="absolute top-38 left-0 w-4 h-4 bg-[#9B4A2C] rounded-full z-10"></div>
              
              {/* Step Number */}
              <div className="mb-8">
                <div className={`text-8xl md:text-9xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent inline-block`}>
                  {step.number}
                </div>
              </div>

              {/* Step Content */}
              <div className="pt-8">
                <h3 className="text-xl md:text-2xl font-bold tracking-tighter text-gray-900 mb-4">
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