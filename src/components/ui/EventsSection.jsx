'use client'

import { useGSAP } from "@gsap/react"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import React, { useRef, useState, useMemo } from "react";
import { Music, Users, Mic2, Trophy, Car, Film, Gamepad2, Sparkles, Zap, Star, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const EventsSection = () => {
  const sectionRef = useRef();
  const [activeCategory, setActiveCategory] = useState('featured');
  const [selectedFact, setSelectedFact] = useState(0);

  // Memoize particles to prevent hydration mismatch
  const particles = useMemo(() => 
    [...Array(20)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2
    })), []
  );

  const funFacts = [
    {
      icon: Star,
      fact: "Over 5000+ students participate in Advay annually from across India!"
    },
    {
      icon: Zap,
      fact: "Advay has been running for 15+ years, making it one of Kerala's longest-running fests!"
    },
    {
      icon: Trophy,
      fact: "₹10 Lakhs+ in prizes distributed across all events every year!"
    },
    {
      icon: Calendar,
      fact: "3 Days of non-stop entertainment, competition, and celebration!"
    }
  ];

  const featuredEvents = [
    {
      title: "Avante Garde",
      subtitle: "Fashion Extravaganza",
      status: "Register",
      icon: Sparkles,
      gradient: "from-red-600 via-black to-red-900",
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
      description: "Showcase your style on the grand runway"
    },
    {
      title: "Battle of Bands",
      subtitle: "Music Competition",
      status: "Register",
      icon: Music,
      gradient: "from-black via-red-800 to-black",
      image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&q=80",
      description: "Rock the stage with your band"
    },
    {
      title: "Deca Dance",
      subtitle: "Dance Championship",
      status: "Register",
      icon: Users,
      gradient: "from-red-900 via-black to-red-600",
      image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80",
      description: "10 dance forms, one ultimate winner"
    },
    {
      title: "Mr and Ms Advay",
      subtitle: "Personality Contest",
      status: "Register",
      icon: Trophy,
      gradient: "from-black via-red-700 to-black",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      description: "Crown the face of Advay 2026"
    }
  ];

  const allEvents = [
    {
      title: "Mr and Ms Advay",
      subtitle: "Personality Contest",
      status: "Register",
      icon: Trophy,
      gradient: "from-red-600 via-black to-red-900",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      description: "Crown the face of Advay 2026"
    },
    {
      title: "DriftX",
      subtitle: "Racing Challenge",
      status: "Open",
      icon: Car,
      gradient: "from-black via-red-800 to-black",
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
      description: "Ultimate street racing competition"
    },
    {
      title: "Roadies",
      subtitle: "Adventure Reality",
      status: "Full",
      icon: Users,
      gradient: "from-red-900 via-black to-red-600",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      description: "Test your limits, face your fears"
    },
    {
      title: "Spot Choreo",
      subtitle: "Instant Dance",
      status: "Register",
      icon: Users,
      gradient: "from-black via-red-700 to-black",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
      description: "Create magic on the spot"
    },
    {
      title: "Symphony",
      subtitle: "Orchestra Performance",
      status: "Register",
      icon: Music,
      gradient: "from-red-600 via-black to-red-900",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
      description: "Harmonize with your team"
    },
    {
      title: "Chithram",
      subtitle: "Short Film Festival",
      status: "Register",
      icon: Film,
      gradient: "from-black via-red-800 to-black",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
      description: "Tell stories through cinema"
    },
    {
      title: "BGMI Competition",
      subtitle: "Gaming Tournament",
      status: "Register",
      icon: Gamepad2,
      gradient: "from-red-900 via-black to-red-600",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      description: "Battle royale supremacy"
    }
  ];

  useGSAP(() => {
    // Title animation with magnetic effect
    gsap.fromTo("#events-title",
      { opacity: 0, scale: 0.3, rotateX: -90 },
      {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: "#events-section",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Fun facts carousel animation
    gsap.fromTo("#facts-carousel",
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#facts-carousel",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate event cards with 3D effect
    const cards = gsap.utils.toArray('.event-card');
    cards.forEach((card, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(card,
        {
          opacity: 0,
          y: 100,
          rotationY: -45,
          scale: 0.7
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)"
        }
      );
    });

    // Floating animation for particles
    gsap.to('.particle', {
      y: 'random(-50, 50)',
      x: 'random(-30, 30)',
      duration: 'random(2, 4)',
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.1,
        from: "random"
      }
    });

  }, [activeCategory]);

  const EventCard = ({ event, index }) => {
    const Icon = event.icon;
    const [isFlipped, setIsFlipped] = useState(false);

    return (
      <div
        className="event-card group relative h-[400px]"
        style={{ perspective: '1000px' }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div 
          className={`relative w-full h-full transition-all duration-700 transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-85`}></div>
            </div>

            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-red-500/20 group-hover:border-red-500/60 transition-all duration-500"></div>

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              {/* Icon & Status */}
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-red-500/20">
                  <Icon className="w-8 h-8 text-red-400" />
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md ${
                  event.status === 'Full' 
                    ? 'bg-gray-800/60 text-gray-300 border border-gray-500/40' 
                    : event.status === 'Open'
                    ? 'bg-green-600/40 text-green-200 border border-green-400/50'
                    : 'bg-red-600/40 text-red-200 border border-red-400/50 animate-pulse'
                }`}>
                  {event.status}
                </span>
              </div>

              {/* Title Section */}
              <div className="space-y-3">
                <div className="inline-block">
                  <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-2 px-3 py-1 bg-black/30 rounded-full backdrop-blur-sm">
                    {event.subtitle}
                  </p>
                </div>
                <h3 className="text-white text-3xl font-black tracking-tight leading-tight group-hover:text-red-300 transition-colors duration-300 drop-shadow-lg">
                  {event.title}
                </h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Hover to learn more
                </p>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden bg-gradient-to-br from-gray-900 via-red-950 to-black border-2 border-red-500/30"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="h-full p-8 flex flex-col justify-between">
              <div>
                <Icon className="w-12 h-12 text-red-400 mb-4" />
                <h4 className="text-white text-2xl font-bold mb-3">{event.title}</h4>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-red-600/20 text-red-300 text-xs rounded-full border border-red-500/30">
                    Team Event
                  </span>
                  <span className="px-3 py-1 bg-red-600/20 text-red-300 text-xs rounded-full border border-red-500/30">
                    All Levels
                  </span>
                </div>
              </div>

              <button 
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 transform ${
                  event.status === 'Full'
                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 active:scale-95'
                }`}
                disabled={event.status === 'Full'}
              >
                {event.status === 'Full' ? 'Registration Closed' : event.status === 'Open' ? 'Join Now →' : 'Register Now →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      id="events-section" 
      ref={sectionRef}
      className="relative min-h-screen bg-black py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Animated background particles - using memoized values */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-red-500/30 rounded-full blur-sm"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/30 via-black to-black"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title Section */}
        <div id="events-title" className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-6 py-2 bg-red-600/20 text-red-400 font-semibold text-sm tracking-widest uppercase rounded-full border border-red-500/30 backdrop-blur-sm">
              Unleash Your Talent
            </span>
          </div>
          <h2 className="text-5xl sm:text-8xl md:text-5xl font-black mb-6 tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              EVENTS
            </span>
          </h2>
          <div className="flex justify-center mb-6">
            <div className="h-1.5 w-40 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate fusion of culture, technology, and pure talent
          </p>
        </div>

        {/* Category Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-black/60 backdrop-blur-xl rounded-2xl p-1.5 border border-red-900/40 shadow-2xl shadow-red-500/10">
            <button
              onClick={() => setActiveCategory('featured')}
              className={`px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                activeCategory === 'featured'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ⭐ Featured
            </button>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📋 All Events
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {(activeCategory === 'featured' ? featuredEvents : allEvents).map((event, index) => (
            <EventCard key={`${activeCategory}-${index}`} event={event} index={index} />
          ))}
        </div>

        {/* View More Button */}
        {activeCategory === 'featured' && (
          <div className="text-center">
            <button
              onClick={() => setActiveCategory('all')}
              className="group relative px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-500 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore All Events
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        )}

         {/* Fun Facts Carousel */}
        <div id="facts-carousel" className="mb-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-950/50 via-black/50 to-red-950/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-red-400 font-bold text-lg tracking-wider uppercase flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Did You Know?
              </h3>
              <div className="flex gap-2">
                {funFacts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFact(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedFact === idx ? 'bg-red-500 w-8' : 'bg-red-500/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-start gap-4">
              {React.createElement(funFacts[selectedFact].icon, { 
                className: "w-12 h-12 text-red-500 flex-shrink-0 mt-1" 
              })}
              <p className="text-white text-2xl font-semibold leading-relaxed">
                {funFacts[selectedFact].fact}
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default EventsSection