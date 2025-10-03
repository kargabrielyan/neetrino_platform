'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { 
  label: string; 
  to?: string; 
  children?: { label: string; to: string }[];
};

type Rect = { x: number; y: number; w: number; h: number };

const items: Item[] = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { 
    label: "Catalog", 
    children: [
      { label: "Website", to: "/catalog/website" },
      { label: "App", to: "/catalog/app" }
    ]
  },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Contact", to: "/contact" },
];


export default function NavDroplet() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const dropdownItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [target, setTarget] = useState<Rect | null>(null);
  const [activeRect, setActiveRect] = useState<Rect | null>(null);
  const [dropdownTarget, setDropdownTarget] = useState<Rect | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const activeKey = useMemo(() => {
    // Сначала проверяем прямые ссылки
    const directMatch = items.find(i => i.to === pathname);
    if (directMatch?.to) return directMatch.to;
    
    // Затем проверяем дочерние элементы
    for (const item of items) {
      if (item.children) {
        const childMatch = item.children.find(child => child.to === pathname);
        if (childMatch?.to) return childMatch.to;
      }
    }
    
    // Возвращаем первую ссылку по умолчанию
    return items.find(i => i.to)?.to ?? items[0].to;
  }, [pathname]);

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

  // Measure element position
  const measure = (key: string): Rect | null => {
    const el = itemRefs.current[key];
    const nav = navRef.current;
    if (!el || !nav) return null;
    const a = el.getBoundingClientRect();
    const b = nav.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
  };

  // Measure dropdown element position
  const measureDropdown = (key: string): Rect | null => {
    const el = dropdownItemRefs.current[key];
    const nav = navRef.current;
    if (!el || !nav) return null;
    const a = el.getBoundingClientRect();
    const b = nav.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
  };

  // Get all possible keys for measurement
  const getAllKeys = () => {
    const keys: string[] = [];
    items.forEach(item => {
      if (item.to) {
        keys.push(item.to);
      }
      if (item.children) {
        item.children.forEach(child => {
          keys.push(child.to);
        });
      }
    });
    return keys;
  };


   // Cleanup timeout on unmount
   useEffect(() => {
     return () => {
       if (hideTimeout) {
         clearTimeout(hideTimeout);
       }
     };
   }, [hideTimeout]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const allKeys = getAllKeys();
      const currentIndex = allKeys.findIndex(key => key === activeKey);
      let newIndex;
      
      if (e.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : allKeys.length - 1;
      } else {
        newIndex = currentIndex < allKeys.length - 1 ? currentIndex + 1 : 0;
      }
      
      const newKey = allKeys[newIndex];
      const r = measure(newKey);
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
        className="relative flex flex-wrap gap-1 p-2 rounded-full glass md:flex-nowrap items-center"
        style={{ filter: "url(#goo)" }}
        tabIndex={0}
      >
        {/* Water droplet */}
        {(target || dropdownTarget) && (
          <motion.div
            aria-hidden="true"
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 0,
              left: 0,
              background: "var(--glass-fill)",
              boxShadow: "0 4px 20px var(--glass-shadow), inset 0 1px 0 var(--glass-highlight), 0 0 0 1px var(--glass-border)",
              backdropFilter: "blur(16px) saturate(120%)",
              WebkitBackdropFilter: "blur(16px) saturate(120%)",
              filter: "url(#wave)",
            }}
            initial={false}
            animate={{
              x: (dropdownTarget || target)!.x - 8,
              y: (dropdownTarget || target)!.y - 6,
              width: (dropdownTarget || target)!.w + 16,
              height: (dropdownTarget || target)!.h + 12,
              borderRadius: (dropdownTarget || target)!.h + 24,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 400, damping: 30, mass: 0.8 }
            }
          />
        )}

        {items.map((item, index) => {
          const isActive = item.to === activeKey || (item.children && item.children.some(child => child.to === activeKey));
          const hasChildren = item.children && item.children.length > 0;
          
          return (
            <li key={item.to || item.label} className="relative flex items-center">
              {hasChildren ? (
                <div
                  ref={(el) => {
                    if (el) {
                      itemRefs.current[item.label] = el as any;
                    }
                  }}
                   onMouseEnter={() => {
                     if (hideTimeout) {
                       clearTimeout(hideTimeout);
                       setHideTimeout(null);
                     }
                     setShowDropdown(item.label);
                     requestAnimationFrame(() => {
                       const r = measure(item.label);
                       if (r) {
                         setTarget(r);
                       }
                     });
                   }}
                   onMouseLeave={() => {
                     const timeout = setTimeout(() => {
                       setShowDropdown(null);
                     }, 150);
                     setHideTimeout(timeout);
                   }}
                  className={[
                    "relative z-10 px-3 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm lg:text-base transition-colors duration-200 focus-ring cursor-pointer inline-block",
                    isActive
                      ? "text-ink font-medium"
                      : "text-ink/70 hover:text-ink font-normal",
                  ].join(" ")}
                >
                  {item.label}
                  
                  {/* Dropdown menu */}
                  <AnimatePresence>
                    {showDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ 
                          duration: 0.2,
                          ease: [0.2, 0.8, 0.2, 1]
                        }}
                        className="absolute top-full left-0 mt-0 w-[115px] z-50"
                        style={{ 
                          filter: "url(#goo)"
                        }}
                        onMouseEnter={() => {
                          if (hideTimeout) {
                            clearTimeout(hideTimeout);
                            setHideTimeout(null);
                          }
                          setShowDropdown(item.label);
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => {
                            setShowDropdown(null);
                          }, 150);
                          setHideTimeout(timeout);
                        }}
                      >
                        <ul className="menu inline-flex w-[110px] flex-col rounded-2xl bg-white/5 backdrop-blur-xl overflow-hidden p-1">
                          {item.children?.map((child) => (
                            <li key={child.to}>
                              <button
                                ref={(el) => {
                                  if (el) {
                                    dropdownItemRefs.current[child.to] = el;
                                  }
                                }}
                                onClick={() => {
                                  window.location.href = child.to;
                                }}
                                onMouseEnter={() => {
                                  requestAnimationFrame(() => {
                                    const r = measureDropdown(child.to);
                                    if (r) {
                                      setDropdownTarget(r);
                                      setTarget(null);
                                    }
                                  });
                                }}
                                onMouseLeave={() => {
                                  setDropdownTarget(null);
                                  requestAnimationFrame(() => {
                                    const r = measure(item.label);
                                    if (r) setTarget(r);
                                  });
                                }}
                                className={[
                                  "menu-item isolate relative z-0 w-full rounded-xl px-4 py-2 text-left",
                                  child.to === activeKey
                                    ? "text-white font-normal"
                                    : "text-white/70 font-normal"
                                ].join(" ")}
                                style={{
                                  fontFamily: 'Inter, "Inter Fallback", sans-serif',
                                  fontSize: '16px',
                                  lineHeight: '24px',
                                  fontWeight: 400
                                }}
                                aria-current={child.to === activeKey ? "page" : undefined}
                              >
                                {child.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  ref={(el) => {
                    if (el) {
                      itemRefs.current[item.to!] = el;
                    }
                  }}
                  href={item.to!}
                  onMouseEnter={() => {
                    requestAnimationFrame(() => {
                      const r = measure(item.to!);
                      if (r) setTarget(r);
                    });
                  }}
                  className={[
                    "relative z-10 px-3 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm lg:text-base transition-colors duration-200 focus-ring inline-block",
                    isActive
                      ? "text-ink font-medium"
                      : "text-ink/70 hover:text-ink font-normal",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}