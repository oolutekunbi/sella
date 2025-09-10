import React from 'react';
import { Music, Dribbble, Home, Settings, Clock, TrendingUp, Zap, Package, MapPin } from 'lucide-react';

const BentoGrid = () => {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto align-middle items-center flex flex-col">

      <h2 className="text-7xl font-bold tracking-tight mb-6">Built for Ghanaian Sellers</h2>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-lg text-center pb-7">
            Whether you sell wigs, meals, beauty products, or secondhand clothes, Sella helps you:
              </p>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Top Left Card - Streamline Procurement */}
          <div className="bg-[#A9968D] rounded-3xl p-8 flex flex-col justify-between min-h-[400px] transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {/* Phone Mockup */}
           
            
            {/* Content */}
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter  mb-4">
                STREAMLINE YOUR PROCUREMENT PROCESS
              </h2>
              <p className="text-lg opacity-90 max-w-md mx-auto">
                Discover how our platform can help construction managers simplify and optimize their procurement process.
              </p>
            </div>
          </div>

          {/* Top Right Card - Manage Projects */}
          <div className="bg-[#A9968D] rounded-3xl p-8 flex flex-col justify-between min-h-[400px] transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="text-center text-white mb-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                EFFICIENTLY MANAGE YOUR PROJECTS 
              </h2>
              <p className="text-lg opacity-90 max-w-md mx-auto mb-8">
                Find all your construction projects in one place and easily purchase the materials you need.
              </p>
            </div>
            
          
          </div>

          {/* Bottom Full Width Card - Track and Control */}
          <div className="lg:col-span-2 bg-[#A9968D] rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between min-h-[400px] transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {/* Left Content */}
            <div className="lg:w-1/2 text-white mb-8 lg:mb-0">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                TRACK AND CONTROL PROJECT COSTS
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-md">
                Discover how our platform can help construction managers simplify and optimize their procurement process.
              </p>
              
           
            </div>

            {/* Right Phone Mockup */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="bg-black rounded-3xl p-2 w-72 h-96 relative">
                <div className="bg-gray-900 rounded-2xl h-full p-4 text-white relative overflow-hidden">
                  {/* Status bar */}
                  <div className="flex justify-between items-center mb-6 text-xs">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <span>←</span>
                    <span className="font-medium">Your Activity</span>
                    <span>⋮</span>
                  </div>
                  
                  {/* Amount */}
                  <div className="text-center mb-8">
                    <div className="text-3xl font-bold">$25,647.00</div>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="flex justify-center items-end space-x-2 mb-8 h-32">
                    {Array.from({length: 7}).map((_, i) => (
                      <div key={i} className={`w-6 rounded-t ${i === 3 ? 'h-24 bg-lime-400' : 'h-8 bg-gray-600'}`}></div>
                    ))}
                  </div>
                  
                  {/* Week days */}
                  <div className="flex justify-center space-x-6 text-xs mb-6">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <span key={i} className={i === 3 ? 'text-lime-400' : 'text-gray-400'}>
                        {String(5 + i).padStart(2, '0')}<br/>{day}
                      </span>
                    ))}
                  </div>
                  
                  {/* Bottom controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                    <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs">D</button>
                    <button className="w-12 h-8 bg-lime-400 text-black rounded-full flex items-center justify-center text-xs font-bold">Week</button>
                    <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs">M</button>
                  </div>
                  
                  {/* Side text */}
                  <div className="absolute right-2 bottom-20 text-xs text-gray-400 writing-mode-vertical text-orientation-mixed transform rotate-90 origin-center">
                    <div className="text-right">
                      EMPOWERING<br/>YOUR<br/>FINANCIAL<br/>FUTURE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;