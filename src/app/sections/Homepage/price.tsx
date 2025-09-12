'use client'; 

import React, { useState } from 'react';
import { Check, Star, Zap, Shield, Crown } from 'lucide-react';

const PricingComponent = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: <Zap className="w-8 h-8" />,
      description: "Perfect for individuals and small teams getting started",
      monthlyPrice: 9,
      annualPrice: 90,
      popular: false,
      features: [
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet"
      ],
      buttonText: "Get Started",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Professional",
      icon: <Star className="w-8 h-8" />,
      description: "Ideal for growing businesses and professional teams",
      monthlyPrice: 29,
      annualPrice: 290,
      popular: true,
      features: [
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet"
      ],
      buttonText: "Start Free Trial",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Enterprise",
      icon: <Crown className="w-8 h-8" />,
      description: "For large organizations with advanced requirements",
      monthlyPrice: 99,
      annualPrice: 990,
      popular: false,
      features: [
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
       
      ],
      buttonText: "Contact Sales",
      color: "from-orange-500 to-red-500"
    }
  ];

  interface PricingPlan {
    name?: string;
    icon?: React.JSX.Element;
    description?: string;
    monthlyPrice: number | string;
    annualPrice: number | string;
    popular?: boolean;
    features?: string[];
    buttonText?: string;
    color?: string;
  }

  const getPrice = (plan: PricingPlan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: PricingPlan) => {
    const monthlyCost = Number(plan.monthlyPrice) * 12;
    const annualCost = Number(plan.annualPrice);
    return Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
       
          
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tighter">
            Choose Your Perfect Plan
      
          </h1>
          
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            Start free and scale as you grow. No hidden fees, no vendor lock-in.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 bg-[#a9968d] backdrop-blur-sm rounded-2xl p-2 w-fit mx-auto">
            <span className={`px-6 py-3 rounded-xl transition-all duration-300 ${!isAnnual ? 'bg-white text-gray-900 shadow-lg' : 'text-white'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-[black] rounded-full transition-colors duration-300"
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center ${isAnnual ? 'bg-white text-black shadow-lg' : 'text-white'}`}>
              Annual
              <span className="ml-2 px-2 py-1 bg-black text-white text-xs rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-black backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:bg-black ${
                plan.popular ? 'ring-2 shadow-2xl shadow-purple-500/20' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#b36744] text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Icon */}
              <div className={`inline-flex p-3 rounded-2xl  text-white mb-6`}>
                {plan.icon}
              </div>

              {/* Plan Name & Description */}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-300 mb-8">{plan.description}</p>

              {/* Pricing */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">${getPrice(plan)}</span>
                  <span className="text-gray-400 ml-2">/{isAnnual ? 'year' : 'month'}</span>
                </div>
                {isAnnual && (
                  <div className="text-green-400 text-sm mt-2">
                    Save {getSavings(plan)}% with annual billing
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button className={`w-full py-4 px-6 rounded-2xl font-semibold text-black mb-8 transition-all duration-300 transform hover:scale-105 ${
                plan.popular 
                  ? 'bg-[#F7EBD2] hover:shadow-xl hover:shadow-black-500/25' 
                  : 'bg-white hover:bg-white-600'
              }`}>
                {plan.buttonText}
              </button>

              {/* Features List */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white mb-4">Everything included:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-[#A9968D] backdrop-blur-sm rounded-3xl p-12 max-w-4xl mx-auto border border-purple-500/20">
            <h3 className="text-3xl font-bold text-[#EBFFEE] mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-200 mb-8 text-lg">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-black text-white rounded-2xl font-semibold hover:shadow-xl  transition-all duration-300">
                Schedule a Demo
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:border-black transition-all duration-300">
                Contact Support
              </button>
            </div>
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default PricingComponent;