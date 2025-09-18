'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { label: string; to: string };

const items: Item[] = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Catalog", to: "/catalog" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

type Rect = { x: number; y: number; w: number; h: number };

export default function NavDroplet() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [target, setTarget] = useState<Rect | null>(null);
  const [activeRect, setActiveRect] = useState<Rect | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const activeKey = useMemo(
    () => items.find(i => i.to === pathname)?.to ?? items[0].to,
    [pathname]
  );

  // Measure element position
  const measure = (key: string): Rect | null => {
    const el = itemRefs.current[key];
    const nav = navRef.current;
    if (!el || !nav) return null;
    const a = el.getBoundingClientRect();
    const b = nav.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
  };

  // Set target to active item on load and resize
  useLayoutEffect(() => {
    const r = measure(activeKey);
    setActiveRect(r);
    setTarget(r);
  }, [activeKey]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const r = measure(activeKey);
        setActiveRect(r);
        setTarget(r);
      }, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timeoutId);
    };
  }, [activeKey]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = items.findIndex(item => item.to === activeKey);
      let newIndex;
      
      if (e.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      } else {
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      }
      
      const newItem = items[newIndex];
      const r = measure(newItem.to);
      if (r) {
        setTarget(r);
        setFocusedIndex(newIndex);
      }
    }
  };

  return (
    <nav className="relative" role="navigation" aria-label="Main navigation">
      {/* SVG filters for gooey effect */}
      <svg className="absolute -z-10 opacity-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
            <feColorMatrix in="blur" mode="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -7" result="goo"/>
            <feBlend in="SourceGraphic" in2="goo"/>
          </filter>
          <filter id="wave">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      <ul
        ref={navRef}
        onMouseLeave={() => setTarget(activeRect)}
        onKeyDown={handleKeyDown}
        className="relative flex gap-1 p-2 rounded-full glass"
        style={{ filter: "url(#goo)" }}
        tabIndex={0}
      >
        {/* Water droplet */}
        {target && (
          <motion.div
            aria-hidden="true"
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 0,
              left: 0,
              background: "linear-gradient(90deg, rgba(0,122,255,0.4), rgba(175,82,222,0.4) 38%, rgba(255,45,85,0.4) 72%, rgba(255,149,0,0.4))",
              boxShadow: "0 4px 20px rgba(0,122,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px) saturate(120%)",
              WebkitBackdropFilter: "blur(16px) saturate(120%)",
              filter: "url(#wave)",
            }}
            initial={false}
            animate={{
              x: target.x - 8,
              y: target.y - 6,
              width: target.w + 16,
              height: target.h + 12,
              borderRadius: target.h + 24,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 400, damping: 30, mass: 0.8 }
            }
          />
        )}

        {items.map((item) => {
          const isActive = item.to === activeKey;
          return (
            <li key={item.to} className="relative">
              <Link
                ref={(el) => (itemRefs.current[item.to] = el)}
                href={item.to}
                onMouseEnter={() => {
                  requestAnimationFrame(() => {
                    const r = measure(item.to);
                    if (r) setTarget(r);
                  });
                }}
                className={[
                  "relative z-10 px-5 py-2.5 rounded-full text-sm md:text-base transition-colors duration-200 focus-ring",
                  // Active item doesn't change color on hover
                  isActive
                    ? "text-ink font-medium"
                    : "text-ink/70 hover:text-ink font-normal",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}