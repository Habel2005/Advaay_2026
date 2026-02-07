'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useMobile } from '@/hooks/useMobile';

// --- Utility Components ---

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    },
)
Button.displayName = "Button"

export function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 8 }, (_, i) => ({ 
        id: i,
        d: `M-${380 - i * 15 * position} -${189 + i * 6}C-${380 - i * 15 * position
            } -${189 + i * 6} -${312 - i * 15 * position} ${216 - i * 6} ${152 - i * 15 * position
            } ${343 - i * 6}C${616 - i * 15 * position} ${470 - i * 6} ${684 - i * 15 * position
            } ${875 - i * 6} ${684 - i * 15 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none" >
            <svg
                className="w-full h-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div >
    );
}

// --- Parallax Components ---

export function ParallaxReveal({
    backgroundImage,
    foregroundImage,
    height = '200vh',
    children,
}: { backgroundImage: string; foregroundImage: string; height?: string; children?: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 40%', 'end start'], 
    });

    const backgroundY = useTransform(scrollYProgress, [0, 0.30], ['5vh', '0vh']);
    const childrenOpacity = useTransform(scrollYProgress, [0.20, 0.30], [0, 1]);
    const childrenY = useTransform(scrollYProgress, [0.0, 0.2], [50, 0]);

    return (
        <div ref={containerRef} className="relative w-full" style={{ height }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{ y: backgroundY, scale: 1, willChange: 'transform' }}
                >
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={backgroundImage}
                            alt="Background"
                            className="w-full h-full object-cover grayscale"
                            width={1920}
                            height={1080}
                            sizes="100vw"
                            unoptimized 
                            priority
                        />
                    </div>
                </motion.div>

                {children && (
                    <motion.div
                        className="absolute inset-0 w-full h-full z-20 flex items-center justify-center pointer-events-none"
                        style={{ opacity: childrenOpacity, y: childrenY }}
                    >
                        {children}
                    </motion.div>
                )}

                <motion.div
                    className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                    style={{ scale: 1, y: '-3vh' }}
                >
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={foregroundImage}
                            alt="Foreground"
                            className="w-full h-full object-cover grayscale"
                            width={1920}
                            height={1080}
                            sizes="100vw"
                            unoptimized 
                            priority
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// --- Main Scene Component ---

export default function Scene2() {
    const isMobile = useMobile();
    
    // Define the fade size: smaller on mobile to save space, larger on desktop
    const fadeSize = isMobile ? '100px' : '150px';

    return (
        <motion.div
            className="bg-black relative z-10"
            style={{
                /* The linear gradient mask creates the "fade away" effect at the top.
                  Content starts at 0% opacity and becomes fully visible after `fadeSize` pixels.
                */
                WebkitMaskImage: `linear-gradient(to bottom, transparent, black ${fadeSize})`,
                maskImage: `linear-gradient(to bottom, transparent, black ${fadeSize})`,
            }}
        >
            <ParallaxReveal
                backgroundImage="/images/up6.JPG"
                foregroundImage="/images/down5.png"
                height="100vh"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full flex justify-center items-center px-4 translate-y-[33vh]"
                >
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-4xl md:text-6xl font-mono tracking-tighter text-center leading-none flex gap-3 justify-center items-center group">
                            <span className="font-bold text-white">ABOUT</span>
                            <span className="text-red-500 animate-pulse">//</span>
                            <span className="font-light text-gray-300 group-hover:text-white transition-colors">US</span>
                        </h2>
                    </div>
                </motion.div>
            </ParallaxReveal>

            <section className="relative bg-black pt-0 md:pt-12 pb-32 overflow-hidden">
                {/* Background Decorative Text */}
                <div className="absolute top-[5%] left-0 w-full overflow-hidden pointer-events-none select-none z-0">
                    <h2 className="text-[25vw] font-bebas text-white/5 leading-none tracking-tighter whitespace-nowrap opacity-20">
                        ADVAY 2026
                    </h2>
                </div>
                <div className="absolute bottom-[5%] right-0 w-full overflow-hidden pointer-events-none select-none z-0 flex justify-end">
                    <h2 className="text-[25vw] font-bebas text-white/5 leading-none tracking-tighter whitespace-nowrap opacity-20">
                        FUTURE
                    </h2>
                </div>

                {/* Floating SVG Background */}
                <div className="absolute top-1/2 left-0 w-full h-[80vh] -translate-y-1/2 -z-0 opacity-80 pointer-events-none mix-blend-screen scale-150 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]">
                    <div className="relative w-full h-full overflow-hidden bg-transparent opacity-60">
                        <div className="absolute inset-0">
                            <FloatingPaths position={1} />
                            <FloatingPaths position={-1} />
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 lg:px-24 space-y-12 md:space-y-24">
                    {/* First Feature: Advay General */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12 relative">
                            <div className="w-full md:w-1/2 relative z-10">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)] group-hover:shadow-[0_0_80px_-10px_rgba(220,38,38,0.5)] transition-shadow duration-700">
                                    <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/images/advay_fashion_bw1.jpg"
                                        alt="ADVAY Fashion"
                                        className="w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover:scale-105 grayscale contrast-125"
                                    />
                                </div>
                                <div className="absolute -bottom-10 -left-10 w-full h-full border border-red-500/20 z-0 hidden md:block" />
                            </div>

                            <div className="w-full md:w-2/5 relative z-20 -mt-10 md:mt-0 md:-ml-20">
                                <div className="bg-black/80 border border-white/10 p-8 md:p-12 relative overflow-hidden">
                                    <div className="space-y-6 relative z-10">
                                        <div className="space-y-1">
                                            <span className="block font-mono text-xs text-red-500 tracking-[0.3em]">NATIONAL // LEVEL</span>
                                            <h2 className="text-6xl md:text-7xl font-bebas text-white tracking-wide leading-[0.85]">
                                                <span className="text-red-500">A</span>DVAY
                                            </h2>
                                        </div>
                                        <div className="h-px w-12 bg-red-500" />
                                        <div className="space-y-4">
                                            <p className="text-white font-medium text-lg leading-tight">
                                                Advay is a <span className="text-red-500 italic">National-level</span> Techno Cultural fest of Toc H Institute of Science & Technology.
                                            </p>
                                            <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                                                Taking place annually at TIST, Advay features a wide range of cultural and technical events, including Deca Dance, Roadies, Fashion show, and music performances.
                                            </p>
                                        </div>
                                        <button className="group flex items-center gap-3 text-white font-mono text-sm uppercase tracking-widest hover:text-red-400 transition-colors">
                                            <span>Explore Events</span>
                                            <span className="w-8 h-px bg-current transition-all group-hover:w-16" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Feature: Highlights */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-0 md:gap-12 relative">
                            <div className="w-full md:w-1/2 relative z-10">
                                <div className="relative aspect-video md:aspect-[4/3] overflow-hidden rounded-sm border border-white/10 shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)] group-hover:shadow-[0_0_80px_-10px_rgba(220,38,38,0.5)] transition-shadow duration-700">
                                    <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/images/voice_advay24.JPG"
                                        alt="ADVAY Music"
                                        className="w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover:scale-105 grayscale contrast-125"
                                    />
                                </div>
                                <div className="absolute -top-10 -right-10 w-full h-full border border-red-500/20 z-0 hidden md:block" />
                            </div>

                            <div className="w-full md:w-2/5 relative z-20 -mt-10 md:mt-0 md:-mr-20">
                                <div className="bg-black/80 border border-white/10 p-8 md:p-12 relative overflow-hidden">
                                    <div className="space-y-6 relative z-10">
                                        <div className="space-y-1 text-right md:text-left">
                                            <span className="block font-mono text-xs text-red-500 tracking-[0.3em] uppercase">Tech // Cultural</span>
                                            <h2 className="text-5xl md:text-6xl font-bebas text-white tracking-wide leading-[0.85]">
                                                HIGH<span className="text-white">LIGHTS</span>
                                            </h2>
                                        </div>
                                        <div className="flex justify-end md:justify-start">
                                            <div className="h-px w-12 bg-red-500" />
                                        </div>
                                        <div className="space-y-6 text-right md:text-left">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">120+ Events</h3>
                                                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                                                    A plethora of events ranging from enigmatic culturals to brain-storming technical shows shall be proudly presented.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">KTU Points</h3>
                                                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                                                    Hop onto a meritorious journey where entertainment, informative workshops, and engaging events are all just a tap away!!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
