'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useMobile } from '@/hooks/useMobile';
import { initLenis, startLenisRAF } from '@/lib/lenis';

export function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        const lenis = initLenis();
        startLenisRAF(lenis);


        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
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
    const paths = Array.from({ length: 15 }, (_, i) => ({ // Reduced count from 36
        id: i,
        d: `M-${380 - i * 15 * position} -${189 + i * 6}C-${380 - i * 15 * position
            } -${189 + i * 6} -${312 - i * 15 * position} ${216 - i * 6} ${152 - i * 15 * position
            } ${343 - i * 6}C${616 - i * 15 * position} ${470 - i * 6} ${684 - i * 15 * position
            } ${875 - i * 6} ${684 - i * 15 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none will-change-transform">
            <svg
                className="w-full h-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
                preserveAspectRatio="none"
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
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
}: {
    title?: string;
}) {
    return (
        <div className="relative w-full h-full overflow-hidden bg-transparent opacity-60">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                {/* Removed second FloatingPaths for performance */}
            </div>
        </div>
    );
}

export function GyroTiltBox({ children, className }: { children: React.ReactNode, className?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 50, damping: 10 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 10 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["25deg", "-25deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-25deg", "25deg"]);
    const translateX = useTransform(mouseX, [-0.5, 0.5], ["-15px", "15px"]);
    const translateY = useTransform(mouseY, [-0.5, 0.5], ["-15px", "15px"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXRel = e.clientX - rect.left;
        const mouseYRel = e.clientY - rect.top;

        const xPct = (mouseXRel / width) - 0.5;
        const yPct = (mouseYRel / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
            }}
        >
            {children}
        </motion.div>
    );
}

interface ParallaxTextProps {
    children: React.ReactNode;
    speed?: number;
    className?: string;
    scaleEffect?: boolean; // Add scale effect
    opacityEffect?: boolean; // Add fade effect
}

export function ParallaxText({
    children,
    speed = -0.4,
    className = '',
    scaleEffect = false,
    opacityEffect = false,
}: ParallaxTextProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const effectiveSpeed = isMobile ? speed * 0.5 : speed;

    const y = useTransform(scrollYProgress, [0, 1], [150 * effectiveSpeed, -150 * effectiveSpeed]);

    const scale = scaleEffect
        ? useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 1, 0.8])
        : 1;

    const opacity = opacityEffect
        ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
        : 1;

    return (
        <div ref={ref} className={`relative ${className}`}>
            <motion.div style={{ y, scale, opacity }}>
                {children}
            </motion.div>
        </div>
    );
}

interface ParallaxSectionProps {
    children: React.ReactNode;
    speed?: number; // -1 to 1 (negative = slower, positive = faster)
    className?: string;
    direction?: 'up' | 'down'; // Direction of parallax movement
}

export function ParallaxSection({
    children,
    speed = -0.5,
    className = '',
    direction = 'up',
}: ParallaxSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const mobileSpeed = speed * 0.5;
    const effectiveSpeed = isMobile ? mobileSpeed : speed;

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        direction === 'up' ? [200 * effectiveSpeed, -200 * effectiveSpeed] : [-200 * effectiveSpeed, 200 * effectiveSpeed]
    );

    return (
        <div ref={ref} className={`relative ${className}`}>
            <motion.div
                style={{ y }}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 30,
                    mass: 1,
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}

interface ParallaxImageProps {
    src: string;
    alt: string;
    speed?: number;
    className?: string;
    priority?: boolean;
}

export function ParallaxImage({
    src,
    alt,
    speed = -0.3,
    className = '',
    priority = false,
}: ParallaxImageProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // Mobile-first: Reduce parallax on mobile
    const effectiveSpeed = isMobile ? speed * 0.5 : speed;

    const y = useTransform(scrollYProgress, [0, 1], [100 * effectiveSpeed, -100 * effectiveSpeed]);
    const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div
                style={{ y, scale }}
                className="w-full h-full"
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    className="object-cover"
                    sizes="100vw"
                />
            </motion.div>
        </div>
    );
}

interface ParallaxRevealProps {
    backgroundImage: string; // up.JPG - full image
    foregroundImage: string; // down.png - transparent top, shows only bottom
    height?: string; // Height of the section
    children?: React.ReactNode; // Content to show between the layers
}

export function ParallaxReveal({
    backgroundImage,
    foregroundImage,
    height = '200vh',
    children,
}: ParallaxRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const backgroundY = useTransform(
        scrollYProgress,
        [0, 0.4],
        isMobile ? ['10vh', '0vh'] : ['12vh', '0vh']
    );

    const backgroundScale = useTransform(
        scrollYProgress,
        [0, 0.35],
        isMobile ? [1.07, 1.02] : [1.07, 1.02]
    );

    const foregroundScale = useTransform(
        scrollYProgress,
        [0, 0.15],
        isMobile ? [1, 1.01] : [1, 1.015]
    );


    const childrenOpacity = useTransform(
        scrollYProgress,
        [0.45, 0.65],
        [0, 1]
    );

    const childrenY = useTransform(
        scrollYProgress,
        [0.45, 0.65],
        [50, 0]
    );

    const willChange = 'transform';

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ height }}
        >
            <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">

                {/* Background Layer - up.JPG (moves up from below) */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{ y: backgroundY, scale: backgroundScale, willChange }}
                >
                    <Image
                        src={backgroundImage}
                        alt="Background Concert"
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'center center' }}
                        sizes="(max-width: 768px) 100vw, 100vw"
                        quality={75}
                        priority
                    />
                </motion.div>

                {/* Content Layer - Between background and foreground */}
                {children && (
                    <motion.div
                        className="absolute inset-0 w-full h-full z-20 flex items-center justify-center pointer-events-none"
                        style={{ opacity: childrenOpacity, y: childrenY }}
                    >
                        {children}
                    </motion.div>
                )}

                {/* Foreground Layer - down.png (stays fixed) */}
                <motion.div
                    className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                    style={{ scale: foregroundScale, willChange }}
                >
                    <Image
                        src={foregroundImage}
                        alt="Foreground Crowd"
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'center center' }}
                        sizes="(max-width: 768px) 100vw, 100vw"
                        quality={75}
                        priority
                    />
                </motion.div>
            </div>
        </div>
    );
}

interface ScrollFadeTextProps {
    children: React.ReactNode;
    className?: string;
    fadeInStart?: number;
    fadeInEnd?: number;
    fadeOutStart?: number;
    fadeOutEnd?: number;
    animationType?: 'fade' | 'slideUp' | 'slideDown' | 'blur' | 'zoom';
}

export function ScrollFadeText({
    children,
    className = '',
    fadeInStart = 0,
    fadeInEnd = 0.3,
    fadeOutStart = 0.7,
    fadeOutEnd = 1,
    animationType = 'fade',
}: ScrollFadeTextProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });


    const opacity = useTransform(
        scrollYProgress,
        [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
        [0, 1, 1, 0]
    );


    const getAnimationProps = () => {
        switch (animationType) {
            case 'slideUp':
                const yUp = useTransform(
                    scrollYProgress,
                    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
                    [100, 0, 0, -100]
                );
                return { opacity, y: yUp };

            case 'slideDown':
                const yDown = useTransform(
                    scrollYProgress,
                    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
                    [-100, 0, 0, 100]
                );
                return { opacity, y: yDown };

            case 'blur':
                const blur = useTransform(
                    scrollYProgress,
                    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
                    [10, 0, 0, 10]
                );
                return {
                    opacity,
                    filter: blur.get() !== undefined ? `blur(${blur}px)` : 'blur(0px)'
                };

            case 'zoom':
                const scale = useTransform(
                    scrollYProgress,
                    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
                    [0.5, 1, 1, 1.5]
                );
                return { opacity, scale };

            default: // 'fade'
                return { opacity };
        }
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            <motion.div style={getAnimationProps()}>
                {children}
            </motion.div>
        </div>
    );
}

export default function Scene2() {
    return (
        <div className="bg-black relative z-10">



            {/* Your Parallax Reveal Effect with Text Between Layers */}
            <ParallaxReveal
                backgroundImage="/images/up3.JPG"
                foregroundImage="/images/down2.png"
                height="140vh"
            >
                {/* ABOUT US text - positioned centrally above audience layer */}
                <div className="w-full flex justify-center items-center px-4 translate-y-[38vh]">
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-4xl md:text-6xl font-mono tracking-tighter text-center leading-none flex gap-3 justify-center items-center group">
                            <span className="font-bold text-white">ABOUT</span>
                            <span className="text-red-500 animate-pulse">//</span>
                            <span className="font-light text-gray-300 group-hover:text-white transition-colors">US</span>
                        </h2>
                    </div>
                </div>
            </ParallaxReveal>

            {/* NEON NOIR FEATURE SECTION */}
            <section className="relative bg-black pt-0 md:pt-12 pb-32 overflow-hidden">

                {/* Massive Background Typography - Parallax or Fixed */}
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

                {/* Background Paths Layer - Absolute Full Width */}
                <div className="absolute top-1/2 left-0 w-full h-[80vh] -translate-y-1/2 -z-0 opacity-80 pointer-events-none mix-blend-screen scale-150 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]">
                    <BackgroundPaths title="NEON NOIR" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 lg:px-24 space-y-12 md:space-y-24">

                    {/* Feature 1: FASHION (Runway) */}
                    <div className="relative group">
                        {/* Asymmetrical Layout */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12 relative">

                            {/* Image Composition */}
                            <div className="w-full md:w-1/2 relative z-10">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)] group-hover:shadow-[0_0_80px_-10px_rgba(220,38,38,0.5)] transition-shadow duration-700">
                                    <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/images/advay_fashion_bw.png"
                                        alt="ADVAY Fashion"
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover:scale-105 grayscale contrast-125"
                                    />
                                    {/* Glitch Overlay Elements - Removed IMG_SEQ_001 */}
                                </div>

                                {/* Floating Decor Element */}
                                <div className="absolute -bottom-10 -left-10 w-full h-full border border-red-500/20 z-0 hidden md:block" />
                            </div>

                            {/* Content Card - Overlapping */}
                            <div className="w-full md:w-2/5 relative z-20 -mt-10 md:mt-0 md:-ml-20">
                                <div className="bg-black/80 border border-white/10 p-8 md:p-12 relative overflow-hidden">
                                    {/* Card Shine Effect */}
                                    <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 pointer-events-none" />

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
                                                Taking place annually at TIST, Advay features a wide range of cultural and technical events, including Deca Dance, Roadies, Fashion show, and music performances. Since 2009, it has been a major hub for talented students across Kerala to showcase their skills.
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

                    {/* Feature 2: MUSIC (Highlights/Symphony) - Reversed */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-0 md:gap-12 relative">

                            {/* Image Composition */}
                            <div className="w-full md:w-1/2 relative z-10">
                                <div className="relative aspect-video md:aspect-[4/3] overflow-hidden rounded-sm border border-white/10 shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)] group-hover:shadow-[0_0_80px_-10px_rgba(220,38,38,0.5)] transition-shadow duration-700">
                                    <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/images/voice_advay.JPG"
                                        alt="ADVAY Music"
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover:scale-105 grayscale contrast-125"
                                    />
                                </div>
                                {/* Floating Decor Element */}
                                <div className="absolute -top-10 -right-10 w-full h-full border border-red-500/20 z-0 hidden md:block" />
                            </div>

                            {/* Content Card - Overlapping */}
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
                                                    A plethora of events ranging from enigmatic culturals to brain-storming technical shows shall be proudly presented to all of you.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">KTU Points</h3>
                                                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                                                    Hop onto a meritorious journey where entertainment, informative workshops, and engaging events are all just a tap away!!
                                                </p>
                                            </div>
                                        </div>

                                        {/* Full Lineup button removed */}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>


        </div>
    );
}
