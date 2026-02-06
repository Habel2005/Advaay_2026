'use client';
import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';


// Helper for random background fireworks
const FireworkParticle = ({ index }: { index: number }) => {
    const size = Math.random() * 6 + 2;
    const x = Math.random() * 100;
    const delay = Math.random() * 0.8 + 0.5;
    const duration = Math.random() * 1.2 + 0.8;
    const color = `hsl(${Math.random() * 50 + 0}, 100%, 65%)`;
    const glow = `0 0 ${Math.random() * 7 + 3}px ${color}`;

    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}vw`,
                bottom: '0',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: '50%',
                opacity: 0,
                animation: `explode ${duration}s ease-out ${delay}s forwards`,
                boxShadow: glow,
            }}
        />
    );
};

// Main container for all fireworks
const Fireworks = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
        {Array.from({ length: 50 }).map((_, i) => (
            <FireworkParticle key={`rand-${i}`} index={i} />
        ))}
    </div>
);


// This is the fixed part of the footer that is revealed on scroll.
export default function FooterReveal() {
    const [clickCount, setClickCount] = useState(0);
    const [showFireworks, setShowFireworks] = useState(false);
    const resetTimer = useRef<NodeJS.Timeout | null>(null);

    const handleClick = () => {
        if (resetTimer.current) {
            clearTimeout(resetTimer.current);
        }

        const newClickCount = clickCount + 1;

        if (newClickCount >= 5) {
            setClickCount(5);
            setShowFireworks(true);
            setTimeout(() => {
                setShowFireworks(false);
                setClickCount(0);
            }, 4000); // Hide fireworks and reset
        } else {
            setClickCount(newClickCount);
        }
    };

    useEffect(() => {
        if (clickCount > 0 && clickCount < 5) {
            resetTimer.current = setTimeout(() => {
                setClickCount(0);
            }, 1000); // Reset after 1 second of inactivity
        }

        return () => {
            if (resetTimer.current) {
                clearTimeout(resetTimer.current);
            }
        };
    }, [clickCount]);

    const fillPercentage = (clickCount / 5) * 100;

    const wrapperStyle: CSSProperties = {
        userSelect: 'none',
        cursor: 'pointer',
        position: 'relative',
        display: 'inline-block',
    };

    const baseTextStyle: CSSProperties = {
        color: 'rgba(229, 228, 226, 0.7)',
        display: 'block',
        padding: '2px 0',
    };

    const filledWrapperStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: `${fillPercentage}%`,
        backgroundColor: '#E50914',
        transition: 'width 0.4s ease-out',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    };

    const filledTextStyle: CSSProperties = {
        color: '#FFFFFF',
        display: 'block',
        padding: '2px 0',
    };


    return (
        <div className="fixed bottom-0 left-0 w-full h-[20vh] md:h-[46vh] z-0 flex flex-col justify-end bg-[#050000] overflow-hidden">
            {showFireworks && <Fireworks />}
            
            <div className="absolute inset-0 flex justify-center items-end pointer-events-none select-none z-0">
                <h1 className="text-[23vw] md:text-[23vw] leading-[0.75] font-black tracking-tighter text-[#3a0505] whitespace-nowrap">
                    ADVAY'26
                </h1>
            </div>

            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 items-center gap-y-4 md:gap-y-0 px-8 py-8 text-[10px] uppercase tracking-widest text-red-900/70 border-t border-red-900/20 bg-transparent">
                <div className="flex justify-start">
                    <div onClick={handleClick} style={wrapperStyle}>
                        <span style={baseTextStyle}>© 2026 ADVAAY</span>
                        <div style={filledWrapperStyle}>
                            <span style={filledTextStyle}>© 2026 ADVAAY</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes explode {
                    0% { transform: translateY(0) scale(0.5); opacity: 1; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-150px) scale(1.2); opacity: 0; }
                }
            `}</style>

        </div>
    );
}
