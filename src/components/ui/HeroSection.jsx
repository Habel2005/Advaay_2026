'use client'

import React, { useRef, useState, useMemo, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { Sparkles, Zap, Trophy, Users, Award, Target } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function HeroAboutSponsors() {

  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const cardRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  const particles = useMemo(() =>
    [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2
    })), []
  )

  useEffect(() => setMounted(true), [])

  /* ---------------- GSAP ---------------- */

  useGSAP(() => {

    gsap.fromTo(".hero-title",
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2 }
    )

    gsap.fromTo(".hero-tagline",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.6 }
    )

    gsap.fromTo(".hero-buttons",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 1 }
    )

    ScrollTrigger.create({
      trigger: aboutRef.current,
      start: "top bottom",
      end: "top top",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        gsap.to(heroRef.current, {
          scale: 1 - p * 0.7,
          y: p * 200,
          borderRadius: p * 24,
          duration: 0
        })
        gsap.to(".hero-content", {
          opacity: 1 - p,
          duration: 0
        })
      }
    })

    gsap.fromTo(".about-badge",
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".about-badge",
          start: "top 80%"
        }
      }
    )

    gsap.fromTo(".about-title",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".about-title",
          start: "top 80%"
        }
      }
    )

    gsap.fromTo(".about-text",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".about-text",
          start: "top 85%"
        }
      }
    )

    gsap.fromTo(".feature-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 85%"
        }
      }
    )

    if (mounted) {
      gsap.to(".particle", {
        y: "random(-40,40)",
        x: "random(-30,30)",
        repeat: -1,
        yoyo: true,
        duration: "random(2,4)",
        ease: "sine.inOut"
      })
    }

  }, { scope: heroRef, dependencies: [mounted] })

  /* ---------------- JSX ---------------- */

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden bg-black flex items-center justify-center"
      >

        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover">
          <source src="/DSC_3804.MP4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-black/70" />

        <div className="hero-content relative z-10 text-center px-6 max-w-4xl">

          <h1
            className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl
            font-medium tracking-[0.35em]
            text-transparent bg-clip-text bg-gradient-to-r
            from-red-400 via-red-300 to-red-500"
          >
            ADVAY
          </h1>

          <p className="mt-2 text-red-300 tracking-[0.5em] text-lg">
            2026
          </p>

          <p className="hero-tagline mt-6 text-gray-200 text-base sm:text-lg tracking-wider">
            The Future is Here
          </p>

          <div className="hero-buttons mt-10 flex justify-center gap-6 flex-wrap">

            <button className="px-10 py-3 rounded-full bg-red-600 hover:bg-red-700
              text-white font-medium transition-all hover:scale-105">
              Explore Events
            </button>

            <button className="px-10 py-3 rounded-full border border-red-500/60
              text-red-400 hover:bg-red-500/10 transition-all">
              Register Now
            </button>

          </div>
        </div>

      </section>

      {/* ABOUT */}
      <section
        ref={aboutRef}
        className="relative min-h-screen bg-black py-24 px-6 overflow-hidden"
      >

        {mounted && particles.map((p, i) => (
          <span
            key={i}
            className="particle absolute w-2 h-2 bg-red-500/20 rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14">

          {/* CARD */}
          <div className="lg:sticky lg:top-24">
            <div
              ref={cardRef}
              className="relative h-[420px] lg:h-[520px]
              rounded-3xl overflow-hidden border border-red-500/20
              shadow-2xl shadow-red-500/30"
            >
              <video autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover">
                <source src="/DSC_3804.MP4" type="video/mp4" />
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-red-950/40 to-transparent" />

              <div className="absolute bottom-0 p-8">
                <h3 className="text-3xl font-semibold text-red-400">
                  ADVAY 2026
                </h3>
                <p className="text-red-300 text-sm">
                  The Ultimate Fest Experience
                </p>
              </div>

            </div>
          </div>

          {/* TEXT */}
          <div className="space-y-6">

            <div className="about-badge inline-flex gap-2 px-4 py-2
              bg-red-600/20 border border-red-500/30 rounded-full">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium uppercase">
                About Advay
              </span>
            </div>

            <h2
              className="about-title text-4xl sm:text-5xl md:text-6xl
              font-semibold text-transparent bg-clip-text
              bg-gradient-to-r from-red-500 to-red-600"
            >
              Advay
            </h2>

            <p className="about-text text-gray-300 text-base sm:text-lg">
              Advay is a <span className="text-red-400 font-semibold">
                National-level Techno Cultural fest
              </span> held annually at TocH Institute of Science and Technology (TIST).
            </p>

            <p className="about-text text-gray-300 text-base sm:text-lg">
              Since <span className="text-red-400 font-semibold">2009</span>,
              Advay has been a hub for talented students across Kerala.
            </p>

            <div className="features-grid grid sm:grid-cols-2 gap-6 pt-6">

              <div className="feature-card bg-red-950/40 border border-red-500/30 rounded-2xl p-6">
                <Trophy className="text-red-400 mb-3" />
                <h3 className="text-3xl font-bold text-red-500">120+</h3>
                <p className="text-red-300 text-sm">Events</p>
              </div>

              <div className="feature-card bg-red-950/40 border border-red-500/30 rounded-2xl p-6">
                <Award className="text-red-400 mb-3" />
                <h3 className="text-3xl font-bold text-red-500">KTU</h3>
                <p className="text-red-300 text-sm">Points</p>
              </div>

            </div>

          </div>

        </div>

      </section>

    </>
  )
}
