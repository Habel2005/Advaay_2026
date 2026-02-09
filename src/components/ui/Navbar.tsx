'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { COLORS, NAV_ITEMS } from '@/lib/constants';
import MobileMenu from './MobileMenu';
import CipherText from './CipherText'; // Import the new component
import { GooeyText } from './GooeyText';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('HOME');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.label.toLowerCase())).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.toUpperCase());
          }
        });
      },
      { threshold: 0.2 } // Adjust threshold as needed
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
    );
  }, { scope: navRef });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const targetId = href.substring(2);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href === '/' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    // For other cases, like being on a different page, we let the default browser
    // behavior handle the navigation. The <a> tag's href will work as expected.
  };

  const handleRegisterClick = () => {
    router.push('/events');
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '16px 16px' : '16px 24px',
        }}
      >
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '4px',
              }}
            >
              <div style={{ width: '24px', height: '2px', background: COLORS.text }} />
              <div style={{ width: '24px', height: '2px', background: COLORS.text }} />
            </button>
          )}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'system-ui, sans-serif',
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: COLORS.text,
                height: isMobile ? '28px' : '28px',
                minWidth: isMobile ? '60px' : '80px',
                marginTop: isMobile ? '1.5em' : '0',
                marginLeft: isMobile ? '2.5em' : '1.5em',
              }}
            >
              <GooeyText
                texts={['ADVAY', 'അദ്വയ്', 'अधवे']}
                morphTime={1.5}
                cooldownTime={2}
                className="h-full"
                textClassName="text-white font-bold"
              />
            </div>
          </a>
        </div>

        {/* Center Navigation Links (Desktop Only) */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.label;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    color: isActive ? COLORS.red : COLORS.textMuted,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 50,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = COLORS.textMuted;
                  }}
                >
                  {isActive && (
                    <span
                      style={{ width: '4px', height: '4px', background: COLORS.red, borderRadius: '50%' }}
                    />
                  )}
                  <CipherText text={item.label} />
                </a>
              );
            })}
          </div>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegisterClick}
          style={{
            padding: isMobile ? '10px 16px' : '12px 24px',
            background: 'transparent',
            border: `1px solid ${COLORS.red}`,
            color: COLORS.text,
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.red;
            e.currentTarget.style.color = COLORS.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = COLORS.text;
          }}
        >
          {isMobile ? 'REGISTER' : 'REGISTER NOW'}
          {/* <CipherText text={isMobile ? 'REGISTER' : 'REGISTER NOW'} /> */}
        </button>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={NAV_ITEMS}
        activeSection={activeSection}
      />
    </>
  );
}
