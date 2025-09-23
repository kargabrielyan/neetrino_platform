'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  ExternalLink
} from 'lucide-react';

export default function About() {
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [timelineHeight, setTimelineHeight] = useState(2000);
  const timelineRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Calculate timeline height based on content
  const calculateTimelineHeight = useCallback(() => {
    if (timelineRef.current) {
      const contentHeight = timelineRef.current.scrollHeight;
      setTimelineHeight(Math.max(contentHeight, 2000));
    }
  }, []);

  // Check for reduced motion preference and calculate height
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    calculateTimelineHeight();
    
    const handleResize = () => calculateTimelineHeight();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateTimelineHeight]);

  // Calculate point on S-curve based on percentage
  const getPointOnCurve = useCallback((percentage: number, containerWidth: number, containerHeight: number) => {
    const t = percentage / 100;
    const amplitude = Math.min(containerWidth * 0.15, 200); // Responsive amplitude
    
    // S-curve with smooth transitions
    const x = containerWidth / 2 + amplitude * Math.sin(t * Math.PI * 2) * (1 - t * 0.3);
    const y = t * containerHeight;
    
    return { x, y };
  }, []);

  // Intersection Observer for milestone activation
  useEffect(() => {
    if (isReducedMotion) return;

    const milestones = document.querySelectorAll('[data-milestone]');
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-milestone') || '0');
            setActiveMilestone(index);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
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

              <div className="relative max-w-6xl mx-auto">
                {/* SVG Layer with S-Curve */}
                <div className="absolute inset-0 pointer-events-none z-0" style={{ height: `${timelineHeight}px` }}>
                  <svg 
                    className="w-full h-full" 
                    viewBox={`0 0 1200 ${timelineHeight}`}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="14%" stopColor="#10B981" />
                        <stop offset="28%" stopColor="#8B5CF6" />
                        <stop offset="42%" stopColor="#F59E0B" />
                        <stop offset="56%" stopColor="#EF4444" />
                        <stop offset="70%" stopColor="#06B6D4" />
                        <stop offset="84%" stopColor="#84CC16" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                    </defs>
                    
                    {/* Main S-Curve Path */}
                    <path
                      d={`M600,0 C600,${timelineHeight * 0.1} 200,${timelineHeight * 0.2} 600,${timelineHeight * 0.4} C1000,${timelineHeight * 0.6} 200,${timelineHeight * 0.8} 600,${timelineHeight * 0.9} C1000,${timelineHeight * 0.95} 600,${timelineHeight} 600,${timelineHeight}`}
                      stroke="url(#timelineGradient)"
                      strokeWidth="3"
                      fill="none"
                      className="opacity-100"
                      style={{
                        strokeDasharray: isReducedMotion ? 'none' : '2000',
                        strokeDashoffset: isReducedMotion ? '0' : '2000',
                        animation: isReducedMotion ? 'none' : 'drawPath 1.2s ease-in-out forwards'
                      }}
                    />
                  </svg>
                </div>

                {/* Timeline Content */}
                <div ref={timelineRef} className="relative z-10" style={{ minHeight: `${timelineHeight}px` }}>
                  {milestones.map((milestone, index) => {
                    const isLeft = index % 2 === 0;
                    const isActive = activeMilestone === index;
                    const topPosition = (milestone.positionPct / 100) * timelineHeight;
                    
                    return (
                      <div
                        key={milestone.id}
                        data-milestone={index}
                        className="absolute left-1/2 transform -translate-x-1/2"
                        style={{ 
                          top: `${topPosition}px`,
                          width: '100%'
                        }}
                      >
                        <div className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-4 lg:gap-8`}>
                          {/* Content Card */}
                          <div 
                            className={`flex-1 max-w-sm lg:max-w-md transition-all duration-500 ${
                              isActive ? 'transform translate-y-1' : ''
                            } ${isLeft ? 'lg:mr-24' : 'lg:ml-24'}`}
                          >
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
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

                          {/* Connector Line */}
                          <div className={`w-6 lg:w-8 h-0.5 ${
                            milestone.color === 'blue' ? 'bg-blue-500' :
                            milestone.color === 'green' ? 'bg-green-500' :
                            milestone.color === 'purple' ? 'bg-purple-500' :
                            milestone.color === 'yellow' ? 'bg-yellow-500' :
                            milestone.color === 'red' ? 'bg-red-500' :
                            milestone.color === 'cyan' ? 'bg-cyan-500' :
                            'bg-lime-500'
                          }`} />

                          {/* Timeline Node */}
                          <div className="relative z-20">
                            <div className={`rounded-full border-4 border-white dark:border-gray-800 shadow-lg transition-all duration-300 ${
                              isActive ? 'w-8 h-8 scale-110' : 'w-6 h-6'
                            } ${
                              milestone.color === 'blue' ? 'bg-blue-500' :
                              milestone.color === 'green' ? 'bg-green-500' :
                              milestone.color === 'purple' ? 'bg-purple-500' :
                              milestone.color === 'yellow' ? 'bg-yellow-500' :
                              milestone.color === 'red' ? 'bg-red-500' :
                              milestone.color === 'cyan' ? 'bg-cyan-500' :
                              'bg-lime-500'
                            }`} />
                            {isActive && !isReducedMotion && (
                              <div className={`absolute inset-0 rounded-full animate-ping ${
                                milestone.color === 'blue' ? 'bg-blue-400' :
                                milestone.color === 'green' ? 'bg-green-400' :
                                milestone.color === 'purple' ? 'bg-purple-400' :
                                milestone.color === 'yellow' ? 'bg-yellow-400' :
                                milestone.color === 'red' ? 'bg-red-400' :
                                milestone.color === 'cyan' ? 'bg-cyan-400' :
                                'bg-lime-400'
                              }`} />
                            )}
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
          }
          to {
            stroke-dashoffset: 0;
          }
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
        }
      `}</style>
    </>
  );
}
