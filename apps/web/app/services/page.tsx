'use client';

import { useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { 
  Monitor,
  Smartphone,
  Gamepad2,
  Settings,
  CreditCard,
  Server,
  Search,
  Rocket,
  Globe,
  Target,
  Users,
  MessageSquare,
  MapPin,
  Shield,
  Palette,
  Paintbrush,
  FileText,
  ArrowRight
} from 'lucide-react';

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('IT SERVICES');
  
  // Refs для секций
  const itServicesRef = useRef<HTMLDivElement>(null);
  const digitalMarketingRef = useRef<HTMLDivElement>(null);
  const designRef = useRef<HTMLDivElement>(null);

  // Функция скролла к секции
  const scrollToSection = (category: string) => {
    setActiveCategory(category);
    
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    
    switch (category) {
      case 'IT SERVICES':
        targetRef = itServicesRef;
        break;
      case 'DIGITAL MARKETING':
        targetRef = digitalMarketingRef;
        break;
      case 'DESIGN':
        targetRef = designRef;
        break;
    }
    
    if (targetRef?.current) {
      const headerHeight = 84; // Высота header + минимальный отступ
      const elementPosition = targetRef.current.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Точные данные с эталонной страницы
  const categories = [
    { id: 'IT SERVICES', label: 'IT SERVICES', color: 'bg-blue-600', activeColor: 'bg-blue-700' },
    { id: 'DIGITAL MARKETING', label: 'DIGITAL MARKETING', color: 'bg-orange-500', activeColor: 'bg-orange-600' },
    { id: 'DESIGN', label: 'DESIGN', color: 'bg-cyan-500', activeColor: 'bg-cyan-600' }
  ];

  const itServices = [
    {
      icon: Monitor,
      title: 'Website Development',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Smartphone,
      title: 'APP Development',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Gamepad2,
      title: 'Game Development',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Settings,
      title: 'Website Maintenance',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: CreditCard,
      title: 'Payment System Connection',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Server,
      title: 'Hosting Provision and Migration',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Search,
      title: 'QA',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Rocket,
      title: 'Website Speed',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Globe,
      title: 'Buying Domains',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ];

  const digitalMarketingServices = [
    {
      icon: Search,
      title: 'SEO Optimization',
      color: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: Target,
      title: 'PPC Promotion',
      color: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: Globe,
      title: 'Yandex Direct',
      color: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: MessageSquare,
      title: 'SMM',
      color: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: MapPin,
      title: 'Google My Business',
      color: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const designServices = [
    {
      icon: Shield,
      title: 'Branding',
      color: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      icon: Monitor,
      title: 'UX / UI Design',
      color: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      icon: Paintbrush,
      title: 'Logo Creation',
      color: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      icon: FileText,
      title: 'Booklets, Business Cards',
      color: 'bg-cyan-50 dark:bg-cyan-900/20'
    }
  ];

  const getCurrentServices = () => {
    switch (activeCategory) {
      case 'IT SERVICES':
        return itServices;
      case 'DIGITAL MARKETING':
        return digitalMarketingServices;
      case 'DESIGN':
        return designServices;
      default:
        return itServices;
    }
  };

  return (
    <>
      <Head>
        <title>Our Services - Neetrino</title>
        <meta name="description" content="Professional IT services, digital marketing, and design solutions. Website development, app development, SEO optimization, branding, and more." />
        <meta property="og:title" content="Our Services - Neetrino" />
        <meta property="og:description" content="Professional IT services, digital marketing, and design solutions. Website development, app development, SEO optimization, branding, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://co.neetrino.com/en/services/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Services - Neetrino" />
        <meta name="twitter:description" content="Professional IT services, digital marketing, and design solutions. Website development, app development, SEO optimization, branding, and more." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Our Services",
            "description": "Professional IT services, digital marketing, and design solutions",
            "provider": {
              "@type": "Organization",
              "name": "Neetrino"
            },
            "serviceType": ["IT Services", "Digital Marketing", "Design"],
            "areaServed": "Worldwide"
          })}
        </script>
      </Head>
      <Layout>
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Dark Theme Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black dark:opacity-100 opacity-0 transition-opacity duration-300" />
        
        
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-16 sm:pt-20 pb-12 sm:pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6 sm:mb-8 transition-colors duration-300">
                  Our Services
                </h1>
                

                {/* Category Navigation */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => scrollToSection(category.id)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                        activeCategory === category.id 
                          ? category.color 
                          : category.id === 'IT SERVICES' 
                            ? 'bg-blue-600/30 hover:bg-blue-600/50' 
                            : category.id === 'DIGITAL MARKETING'
                              ? 'bg-orange-500/30 hover:bg-orange-500/50'
                              : 'bg-cyan-500/30 hover:bg-cyan-500/50'
                      }`}
                      aria-pressed={activeCategory === category.id}
                      aria-label={`Switch to ${category.label} services`}
                    >
                      {category.label}
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* IT Services Section */}
          <section ref={itServicesRef} className="pt-2 pb-16 sm:pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 sm:mb-12 text-center transition-colors duration-300">
                IT SERVICES
              </h2>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {itServices.map((service, index) => (
                  <div
                    key={index}
                    className={`${service.color} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Digital Marketing Section */}
          <section ref={digitalMarketingRef} className="pt-2 pb-16 sm:pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 sm:mb-12 text-center transition-colors duration-300">
                DIGITAL MARKETING
              </h2>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {digitalMarketingServices.map((service, index) => (
                  <div
                    key={index}
                    className={`${service.color} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Design Section */}
          <section ref={designRef} className="pt-2 pb-16 sm:pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 sm:mb-12 text-center transition-colors duration-300">
                DESIGN
              </h2>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {designServices.map((service, index) => (
                  <div
                    key={index}
                    className={`${service.color} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      </Layout>
    </>
  );
}
