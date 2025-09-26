'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { 
  Users, 
  Target, 
  Award, 
  Lightbulb, 
  Calendar,
  Rocket,
  Globe,
  Code,
  Brain,
  Zap,
  Star,
  Building,
  ArrowRight,
  Mail,
  ExternalLink,
  Shield,
  Heart
} from 'lucide-react';

export default function About() {
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [timelineHeight, setTimelineHeight] = useState(2000);
  const [containerDimensions, setContainerDimensions] = useState({ width: 1200, height: 2000 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
      
      if (timelineRef.current) {
        const contentHeight = timelineRef.current.scrollHeight;
        setTimelineHeight(Math.max(contentHeight + 240, 2000)); // Add padding for curve tails
      }
    }, 150);
  }, []);

  // Calculate timeline height and container dimensions
  const calculateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width: rect.width, height: rect.height });
    }
    
    if (timelineRef.current) {
      const contentHeight = timelineRef.current.scrollHeight;
      setTimelineHeight(Math.max(contentHeight + 240, 2000)); // Add padding for curve tails
    }
  }, []);

  // Check for reduced motion preference and calculate dimensions
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    calculateDimensions();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculateDimensions, handleResize]);

  // Generate smooth S-curve path with fallback
  const generateCurvePath = useCallback((width: number, height: number) => {
    console.log('🎨 Generating curve path:', { width, height });
    
    const padding = 120; // Top and bottom padding
    const effectiveHeight = height - (padding * 2);
    const centerX = width / 2;
    
    // Responsive amplitude based on screen size
    let amplitude;
    if (width >= 1024) {
      amplitude = width * 0.20; // Desktop: 20% of width
    } else if (width >= 768) {
      amplitude = width * 0.16; // Tablet: 16% of width
    } else {
      amplitude = width * 0.12; // Mobile: 12% of width
    }
    
    // Ensure minimum gap from edges
    amplitude = Math.min(amplitude, (width / 2) - 64);
    
    console.log('📐 Curve parameters:', { padding, effectiveHeight, centerX, amplitude });
    
    // Create smooth S-curve with multiple control points
    const points = [];
    const numPoints = 8;
    
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const y = padding + (t * effectiveHeight);
      
      // S-curve formula with smooth transitions - simplified for reliability
      const x = centerX + amplitude * Math.sin(t * Math.PI * 2.5) * Math.pow(1 - t, 0.8);
      
      points.push({ x: Math.max(32, Math.min(width - 32, x)), y: Math.max(padding, Math.min(height - padding, y)) });
    }
    
    console.log('📍 Generated points:', points);
    
    // Generate SVG path with error handling
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (next) {
        // Smooth curve with control points
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y + (curr.y - prev.y) * 0.5;
        const cp2x = curr.x - (next.x - curr.x) * 0.5;
        const cp2y = curr.y - (next.y - curr.y) * 0.5;
        
        path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`;
      } else {
        path += ` L ${curr.x} ${curr.y}`;
      }
    }
    
    console.log('🛤️ Generated path:', path);
    
    return { path, points };
  }, []);

  // Get point on curve by percentage
  const getPointOnCurve = useCallback((percentage: number, width: number, height: number) => {
    const padding = 120;
    const effectiveHeight = height - (padding * 2);
    const centerX = width / 2;
    
    let amplitude;
    if (width >= 1024) {
      amplitude = width * 0.20;
    } else if (width >= 768) {
      amplitude = width * 0.16;
    } else {
      amplitude = width * 0.12;
    }
    
    amplitude = Math.min(amplitude, (width / 2) - 64);
    
    const t = percentage / 100;
    const y = padding + (t * effectiveHeight);
    const x = centerX + amplitude * Math.sin(t * Math.PI * 2.5) * Math.pow(1 - t, 0.8);
    
    return { x, y };
  }, []);

  // Calculate normal vector for connector
  const getNormalVector = useCallback((percentage: number, width: number, height: number) => {
    const delta = 0.01; // Small delta for derivative calculation
    const point1 = getPointOnCurve(Math.max(0, percentage - delta), width, height);
    const point2 = getPointOnCurve(Math.min(100, percentage + delta), width, height);
    
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) return { x: 1, y: 0 };
    
    // Normalize and rotate 90 degrees for normal
    return { x: -dy / length, y: dx / length };
  }, [getPointOnCurve]);

  // Intersection Observer for milestone activation
  useEffect(() => {
    if (isReducedMotion) return;

    const milestones = document.querySelectorAll('[data-milestone]');
    if (milestones.length === 0) return;

    console.log('👀 Setting up milestone observer for', milestones.length, 'milestones');

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const milestoneIndex = parseInt(entry.target.getAttribute('data-milestone') || '0');
            console.log('🎯 Milestone activated:', milestoneIndex, entry.target);
            setActiveMilestone(milestoneIndex);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-30% 0px -30% 0px'
      }
    );

    milestones.forEach((milestone) => {
      observerRef.current?.observe(milestone);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isReducedMotion]);

  const milestones = [
    { id: 'start', positionPct: 5, yearOrDate: '2019', title: 'Company Founded', description: 'Started with a vision to revolutionize digital solutions', icon: Rocket, color: 'blue' },
    { id: 'first-client', positionPct: 20, yearOrDate: '2020', title: 'First Major Client', description: 'Secured our first enterprise client and delivered exceptional results', icon: Users, color: 'green' },
    { id: 'team-expansion', positionPct: 35, yearOrDate: '2021', title: 'Team Expansion', description: 'Grew from 3 to 15 talented professionals across multiple departments', icon: Building, color: 'purple' },
    { id: 'award', positionPct: 50, yearOrDate: '2022', title: 'Industry Recognition', description: 'Received "Best Digital Agency" award from local business association', icon: Award, color: 'yellow' },
    { id: 'international', positionPct: 65, yearOrDate: '2023', title: 'International Expansion', description: 'Opened offices in 3 countries and served clients across 15 nations', icon: Globe, color: 'red' },
    { id: 'innovation', positionPct: 80, yearOrDate: '2024', title: 'AI Integration', description: 'Launched cutting-edge AI-powered solutions for enhanced client experiences', icon: Brain, color: 'cyan' },
    { id: 'future', positionPct: 95, yearOrDate: '2025', title: 'Future Vision', description: 'Continuing to innovate and expand our global presence with new technologies', icon: Star, color: 'lime' }
  ];

  const values = [
    { icon: Target, title: 'Excellence', description: 'We strive for perfection in every project, delivering solutions that exceed expectations.' },
    { icon: Users, title: 'Collaboration', description: 'We believe in the power of teamwork and building strong partnerships with our clients.' },
    { icon: Lightbulb, title: 'Innovation', description: 'We constantly explore new technologies and creative approaches to solve complex problems.' },
    { icon: Zap, title: 'Efficiency', description: 'We optimize processes and workflows to deliver faster results without compromising quality.' },
    { icon: Shield, title: 'Reliability', description: 'We provide consistent, dependable service that our clients can count on.' },
    { icon: Heart, title: 'Passion', description: 'We love what we do and it shows in the quality and care we put into every project.' }
  ];

  const team = [
    { name: 'Alex Johnson', role: 'CEO & Founder', image: '/team/alex.jpg' },
    { name: 'Sarah Chen', role: 'CTO', image: '/team/sarah.jpg' },
    { name: 'Mike Rodriguez', role: 'Lead Designer', image: '/team/mike.jpg' },
    { name: 'Emma Wilson', role: 'Head of Marketing', image: '/team/emma.jpg' }
  ];

  return (
    <>
      <Head>
        <title>About Us - Neetrino Platform</title>
        <meta name="description" content="Learn about Neetrino's journey from startup to industry leader. Discover our values, team, and commitment to revolutionizing digital solutions." />
        <meta property="og:title" content="About Us - Neetrino Platform" />
        <meta property="og:description" content="Learn about Neetrino's journey from startup to industry leader. Discover our values, team, and commitment to revolutionizing digital solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://co.neetrino.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us - Neetrino Platform" />
        <meta name="twitter:description" content="Learn about Neetrino's journey from startup to industry leader. Discover our values, team, and commitment to revolutionizing digital solutions." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Neetrino",
              "description": "Revolutionizing digital solutions through AI-powered technology and innovative web development",
              "foundingDate": "2020",
              "url": "https://co.neetrino.com",
              "logo": "https://co.neetrino.com/logo.png",
              "sameAs": [
                "https://linkedin.com/company/neetrino",
                "https://twitter.com/neetrino"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "AM"
              }
            })
          }}
        />
      </Head>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
          {/* Hero Section */}
          <section className="pt-20 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Building the Future of Web Development
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  We're revolutionizing how businesses create digital experiences through AI-powered solutions and innovative technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Talk to us
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => window.location.href = '/portfolio'}
                    className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    See portfolio
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Curvilinear Timeline */}
          <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Our Journey
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  From startup to industry leader - discover the milestones that shaped our story
                </p>
              </div>

              <div ref={containerRef} className="relative max-w-6xl mx-auto">
                {/* SVG Layer with Professional S-Curve */}
                <div className="absolute inset-0 pointer-events-none z-0" style={{ height: `${timelineHeight}px` }}>
                  <svg 
                    className="w-full h-full" 
                    viewBox={`0 0 ${containerDimensions.width} ${timelineHeight}`}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      {/* Single continuous gradient */}
                      <linearGradient 
                        id="timelineGradient" 
                        x1="0%" 
                        y1="0%" 
                        x2="0%" 
                        y2="100%" 
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="16%" stopColor="#10B981" />
                        <stop offset="32%" stopColor="#8B5CF6" />
                        <stop offset="48%" stopColor="#F59E0B" />
                        <stop offset="64%" stopColor="#EF4444" />
                        <stop offset="80%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                      
                      {/* Glow filter for active nodes */}
                      <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Main S-Curve Path - Generated dynamically with fallback */}
                    <path
                      d={generateCurvePath(containerDimensions.width, timelineHeight).path}
                      stroke="url(#timelineGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      className={`opacity-100 ${!isReducedMotion ? 'timeline-path' : ''}`}
                      style={{
                        strokeDasharray: isReducedMotion ? 'none' : '2000',
                        strokeDashoffset: isReducedMotion ? '0' : '2000',
                        animation: isReducedMotion ? 'none' : 'drawPath 2s ease-in-out forwards'
                      }}
                    />
                    
                    {/* Fallback straight line if curve fails */}
                    <path
                      d={`M ${containerDimensions.width / 2} 120 L ${containerDimensions.width / 2} ${timelineHeight - 120}`}
                      stroke="url(#timelineGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      className="opacity-30"
                      style={{ display: 'none' }}
                    />
                    
                    {/* Timeline Nodes and Connectors */}
                    {milestones.map((milestone, index) => {
                      const isActive = activeMilestone === index;
                      const point = getPointOnCurve(milestone.positionPct, containerDimensions.width, timelineHeight);
                      const normal = getNormalVector(milestone.positionPct, containerDimensions.width, timelineHeight);
                      const isLeft = index % 2 === 0;
                      
                      // Connector length (20px)
                      const connectorLength = 20;
                      const connectorEnd = {
                        x: point.x + normal.x * connectorLength * (isLeft ? -1 : 1),
                        y: point.y + normal.y * connectorLength * (isLeft ? -1 : 1)
                      };
                      
                      return (
                        <g key={milestone.id}>
                          {/* Connector line */}
                          <line
                            x1={point.x}
                            y1={point.y}
                            x2={connectorEnd.x}
                            y2={connectorEnd.y}
                            stroke={milestone.color === 'blue' ? '#3B82F6' :
                                   milestone.color === 'green' ? '#10B981' :
                                   milestone.color === 'purple' ? '#8B5CF6' :
                                   milestone.color === 'yellow' ? '#F59E0B' :
                                   milestone.color === 'red' ? '#EF4444' :
                                   milestone.color === 'cyan' ? '#06B6D4' :
                                   '#84CC16'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            opacity="0.8"
                          />
                          
                          {/* Timeline node */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={isActive ? 14 : 10}
                            fill={milestone.color === 'blue' ? '#3B82F6' :
                                  milestone.color === 'green' ? '#10B981' :
                                  milestone.color === 'purple' ? '#8B5CF6' :
                                  milestone.color === 'yellow' ? '#F59E0B' :
                                  milestone.color === 'red' ? '#EF4444' :
                                  milestone.color === 'cyan' ? '#06B6D4' :
                                  '#84CC16'}
                            stroke="white"
                            strokeWidth="3"
                            filter={isActive ? 'url(#nodeGlow)' : 'none'}
                            className="transition-all duration-300"
                          />
                          
                          {/* Active node pulse - removed to prevent flying circles */}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Timeline Content */}
                <div ref={timelineRef} className="relative z-10" style={{ minHeight: `${timelineHeight}px` }}>
                  {milestones.map((milestone, index) => {
                    const isLeft = index % 2 === 0;
                    const isActive = activeMilestone === index;
                    const point = getPointOnCurve(milestone.positionPct, containerDimensions.width, timelineHeight);
                    const normal = getNormalVector(milestone.positionPct, containerDimensions.width, timelineHeight);
                    
                    // Calculate card position based on curve point and normal
                    const cardOffset = 80; // Distance from curve to card
                    const cardX = point.x + normal.x * cardOffset * (isLeft ? -1 : 1);
                    const cardY = point.y + normal.y * cardOffset * (isLeft ? -1 : 1);
                    
                    return (
                      <div
                        key={milestone.id}
                        data-milestone={index}
                        className="absolute"
                        style={{ 
                          left: `${cardX}px`,
                          top: `${cardY}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* Content Card */}
                        <div 
                          className={`max-w-sm lg:max-w-md transition-all duration-500 ${
                            isActive ? 'transform -translate-y-2 scale-105' : ''
                          }`}
                        >
                          <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${
                            isActive ? 'shadow-2xl ring-2 ring-blue-200 dark:ring-blue-800' : ''
                          }`}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                milestone.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                milestone.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                                milestone.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                milestone.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                milestone.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                                milestone.color === 'cyan' ? 'bg-cyan-100 dark:bg-cyan-900/30' :
                                'bg-lime-100 dark:bg-lime-900/30'
                              }`}>
                                <milestone.icon className={`w-5 h-5 ${
                                  milestone.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                  milestone.color === 'green' ? 'text-green-600 dark:text-green-400' :
                                  milestone.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                  milestone.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                                  milestone.color === 'red' ? 'text-red-600 dark:text-red-400' :
                                  milestone.color === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' :
                                  'text-lime-600 dark:text-lime-400'
                                }`} />
                              </div>
                              <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  {milestone.yearOrDate}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                  {milestone.title}
                                </h3>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Screen Reader Fallback */}
                <div className="sr-only">
                  <h3>Timeline of Company Milestones</h3>
                  <ol>
                    {milestones.map((milestone, index) => (
                      <li key={milestone.id}>
                        <strong>{milestone.yearOrDate}:</strong> {milestone.title} - {milestone.description}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 sm:py-20 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  What We Believe
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Our core values guide everything we do and shape how we work with our clients
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                {values.map((value, index) => (
                  <div 
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                      <value.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Preview Section */}
          <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Meet Our Team
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  The talented individuals who make our vision a reality
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {team.map((member, index) => (
                  <div 
                    key={index}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl group-hover:scale-105 transition-transform duration-300">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Footer */}
          <section className="py-16 sm:py-20 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                  Ready to Start Your Project?
                </h2>
                <p className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-90 max-w-2xl mx-auto">
                  Let's work together to bring your vision to life with cutting-edge technology and innovative solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => window.location.href = '/portfolio'}
                    className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    View Portfolio
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes drawPath {
          from {
            stroke-dashoffset: 2000;
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        
        /* Ensure timeline path is always visible */
        .timeline-path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawPath 2s ease-in-out forwards;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          path {
            stroke-dashoffset: 0 !important;
            animation: none !important;
          }
          
          .timeline-path {
            stroke-dashoffset: 0 !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
