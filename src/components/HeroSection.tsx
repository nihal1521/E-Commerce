import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-accent-50 to-neutral-50 py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <span className="inline-block bg-gradient-to-r from-primary-100 to-accent-100 text-primary-800 text-sm font-semibold px-6 py-3 rounded-full mb-8 border border-primary-200 font-inter">
              ✨ New Collection
            </span>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-8 font-playfair leading-tight">
              Elevate Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 animate-pulse-slow">
                Style Story
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-lg leading-relaxed font-inter">
              Discover our curated collection of handcrafted fashion accessories that blend elegance with everyday functionality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link
                to="/category/handbags"
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-10 py-5 rounded-2xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-inter group"
              >
                Shop Handbags
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/category/hair-accessories"
                className="border-2 border-primary-200 text-neutral-700 px-10 py-5 rounded-2xl font-semibold hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-inter"
              >
                Hair Accessories
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/WhatsApp Image 2025-06-24 at 19.51.59_2edd5ace.jpg"
                alt="Handcrafted Fashion Accessories"
                className="w-full h-[500px] md:h-[600px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-pink-200 rounded-full opacity-60"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-200 rounded-full opacity-40"></div>
            <div className="absolute top-1/2 -left-8 w-16 h-16 bg-indigo-200 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}