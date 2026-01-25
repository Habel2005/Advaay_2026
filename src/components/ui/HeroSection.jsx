'use client'

import { useGSAP } from "@gsap/react"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const scrollRef = useRef();
  const contentRef = useRef();

  useGSAP(() => {
    // Hero text entrance
    gsap.fromTo("#hero-text",
      { opacity: 0, y: 150 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
    );

    // Front content fade out during rotation
    gsap.to("#front-content", {
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top 1%',
        end: 'top -10%',
        scrub: true,
      }
    });

    // Back content fade in after rotation
    gsap.fromTo("#back-content",
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top -10%',
          end: 'top -20%',
          scrub: true,
        }
      }
    );

    // Responsive hero section card flip and shrink
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop, isTablet, isMobile } = context.conditions;

      gsap.to('#hero-section', {
        borderRadius: isDesktop ? '24px' : isTablet ? '20px' : '16px',
        width: isDesktop ? '330px' : isTablet ? '200px' : '180px',
        height: isDesktop ? '383px' : isTablet ? '280px' : '250px',
        y: isDesktop ? 800 : isTablet ? 800 : 800,
        x: isDesktop ? 150 : isTablet ? 80 : 20,
        rotateY: 180,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top 1%',
          end: 'bottom 18%',
          //  end: 'top 80%',
          scrub: true,
        }
      });  
    });

    // Animated boxes
    const boxes = scrollRef.current?.children;
    if (boxes) {
      Array.from(boxes).forEach((box, index) => {
        gsap.to(box, {
          x: window.innerWidth < 768 ? 150 * (index + 2) : 350 * (index + 5),
          rotation: 360,
          borderRadius: "100%",
          scale: window.innerWidth < 768 ? 1.2 : 1.5,
          scrollTrigger: {
            trigger: box,
            start: "bottom bottom",
            end: "top 1%",
            scrub: true,
          },
          ease: "back.inOut"
        });
      });
    }

    // Content section animations
    gsap.fromTo("#content-section",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          // trigger: '#content-section',
          start: 'top 100%',
          // end: 'top 80%',
          scrub: true,
        }
      }
    );

    // Image reveal animation
    gsap.fromTo("#advay-image",
      { opacity: 0, scale: 0.8, x: -50 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        zIndex: 30,
        duration: 1,
        scrollTrigger: {
          trigger: '#advay-image',
          start: 'top 100%',
          end: 'top 80%',
          scrub: true,
        }
      }
    );

    // Text reveal animation
    gsap.fromTo("#advay-text",
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '#advay-text',
          start: 'top 75%',
          end: 'top 45%',
          scrub: true,
        }
      }
    );
  }, []);

  return (
    <div className="relative h-auto overflow-x-hidden bg-gray-50">
      <section
        id="hero-section"
        className="h-screen bg-gradient-to-br z-20 bg-black grid justify-center z-0 pointer-events-none relative overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <source src="/DSC_3804.MP4" type="video/mp4" />
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" style={{ backfaceVisibility: 'hidden' }}></div>

        {/* Front of card */}
        <div id="front-content" className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10" style={{ backfaceVisibility: 'hidden' }}>
          <div id="hero-text" className="text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase">Advay 2026</h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base md:text-lg">The Future is Here</p>
          </div>
        </div>

        {/* Back of card */}
        <div
          id="back-content"
          className="absolute inset-0 flex z-10 items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 opacity-0 px-4"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center p-4 sm:p-6 md:p-8">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Advay 2026</h2>
            <p className="text-gray-200 text-xs sm:text-sm">Innovation & Excellence</p>
            <div className="mt-4 sm:mt-6 space-y-2">
              <p className="text-white text-xs sm:text-sm">Building Tomorrow</p>
              <p className="text-white text-xs sm:text-sm">One Step at a Time</p>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-[150vh] relative z-0 justify-center" ref={scrollRef}>
        <div id="box-1" className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-300" />
        <div id="box-2" className="w-16 h-16 sm:w-20 sm:h-20 bg-green-300" />
        {/* </div> */}

        {/* Content Section */}
        <section id="content-section" className="min-h-screen bg-white py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Image Section */}
              <div id="advay-image" className="relative w-full h-64 z-30 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br  from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <svg className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg sm:text-xl font-semibold">Advay Festival Image</p>
                    <p className="text-xs sm:text-sm mt-2 opacity-90">Replace with your event photo</p>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div id="advay-text" className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Advay
                </h2>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                  Advay is a <span className="font-semibold text-blue-600">National-level Techno Cultural fest</span> that takes place annually at TocH Institute of Science and Technology (TIST). The festival features a wide range of cultural and technical events, including <span className="font-semibold">Deca Dance, Roadies, Fashion show,</span> and <span className="font-semibold">music performances</span>.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                  Since <span className="font-semibold text-purple-600">2009</span>, Advay has been a major hub for talented students across Kerala, providing them with a platform to showcase their skills and abilities.
                </p>

                {/* Stats Section */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">15+</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Years</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">50+</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Events</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-pink-50 to-blue-50 rounded-lg col-span-2 sm:col-span-1">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600">5000+</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Participants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HeroSection