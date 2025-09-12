'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../assets/images/logo.png";
import { authService } from "@/lib/auth";
import { User } from "@supabase/supabase-js";

const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#value" },
    { name: "Why Sella", href: "#whymore" },
    { name: "Pricing", href: "#faqs" }
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = authService.onAuthStateChange((user) => {
            setUser(user);
        });

        return () => subscription.unsubscribe();
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleSignOut = async () => {
        await authService.signOut();
        router.push('/');
    };

    return (
        <>
            <header
                className="z-50 py-10 transition-all duration-500 ease-out"
            >
                <div className="mx-2 px-4 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0 z-10">
                            <Image
                                src={logo}
                                alt="Move Logo"
                                className="h-8 lg:h-10 w-auto transition-all duration-300"
                                priority
                            />
                        </div>


                        <nav className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-8 xl:gap-12">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="relative text-white hover:text-amber-50 font-semibold text-sm transition-all duration-300 group"
                                    >
                                        {link.name}

                                    </a>
                                ))}
                            </div>
                        </nav>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="hidden lg:flex items-center gap-4">
                                    <Link 
                                        href="/dashboard"
                                        className="text-white hover:text-amber-50 font-semibold text-sm transition-all duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="h-10 px-4 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 text-sm"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden lg:flex items-center gap-4">
                                    <Link 
                                        href="/auth/login"
                                        className="text-white hover:text-amber-50 font-semibold text-sm transition-all duration-300"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        href="/auth/signup"
                                        className="h-10 px-4 rounded-full font-semibold text-white bg-[#151515] hover:bg-[#3da77e] transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm flex items-center"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}

                            <button
                                onClick={toggleMobileMenu}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-300 backdrop-blur-sm"
                                aria-label="Toggle mobile menu"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}
                                >
                                    <path d="M21,19H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z" fill="currentColor" />
                                    <path d="M21,13H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z" fill="currentColor" />
                                    <path d="M21,7H3A1,1,0,0,1,3,5H21a1,1,0,0,1,0,2Z" fill="currentColor" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>


                <div className={`lg:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-xl transition-all z-[9999] duration-500 ${isMobileMenuOpen
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible pointer-events-none'
                    }`}>
                    <div className="container mx-auto px-4 py-8">
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link, index) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-2xl font-medium text-gray-700 hover:text-[yellow]  transition-all duration-300 transform hover:translate-x-2 ${isMobileMenuOpen
                                            ? 'translate-y-0 opacity-100'
                                            : 'translate-y-4 opacity-0'
                                        }`}
                                    style={{
                                        transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : '0ms'
                                    }}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>


                        <div className="mt-8">
                            {user ? (
                                <div className="space-y-4">
                                    <Link 
                                        href="/dashboard"
                                        className="w-full h-14 rounded-full font-semibold text-lg text-white bg-[#151515] hover:bg-[#3da77e] transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full h-14 rounded-full font-semibold text-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Link 
                                        href="/auth/login"
                                        className="w-full h-14 rounded-full font-semibold text-lg text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        href="/auth/signup"
                                        className="w-full h-14 rounded-full font-semibold text-lg text-white bg-[#151515] hover:bg-[#3da77e] transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>




        </>
    );
}