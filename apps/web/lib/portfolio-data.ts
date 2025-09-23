export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  cover: {
    url: string;
    width: number;
    height: number;
    blurDataURL: string;
  };
  tags: string[];
  category: 'web' | 'mobile' | 'ai' | 'ecommerce' | 'dashboards' | 'corporate';
  tech: string[];
  client: string;
  year: number;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    slug: 'ecommerce-platform',
    summary: 'Modern e-commerce platform with AI-powered recommendations and real-time analytics',
    description: 'A comprehensive e-commerce solution featuring AI-driven product recommendations, real-time inventory management, and advanced analytics dashboard. Built with Next.js and integrated with multiple payment gateways.',
    cover: {
      url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['E-commerce', 'AI', 'Analytics'],
    category: 'ecommerce',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'OpenAI'],
    client: 'TechCorp',
    year: 2024,
    liveUrl: 'https://example-ecommerce.com',
    githubUrl: 'https://github.com/neetrino/ecommerce-platform',
    caseStudyUrl: '/case-studies/ecommerce-platform',
    featured: true
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    slug: 'mobile-banking-app',
    summary: 'Secure mobile banking application with biometric authentication and real-time transactions',
    description: 'A comprehensive mobile banking solution with advanced security features, biometric authentication, real-time transaction processing, and intuitive user interface. Available for both iOS and Android platforms.',
    cover: {
      url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['Banking', 'Security', 'Mobile'],
    category: 'mobile',
    tech: ['React Native', 'Node.js', 'MongoDB', 'JWT', 'Biometric'],
    client: 'SecureBank',
    year: 2024,
    liveUrl: 'https://apps.apple.com/securebank',
    githubUrl: 'https://github.com/neetrino/mobile-banking',
    caseStudyUrl: '/case-studies/mobile-banking',
    featured: true
  },
  {
    id: '3',
    title: 'AI Chat Assistant',
    slug: 'ai-chat-assistant',
    summary: 'Intelligent chatbot with machine learning capabilities and natural language processing',
    description: 'An advanced AI-powered chatbot that understands context, learns from conversations, and provides intelligent responses. Features include sentiment analysis, multi-language support, and seamless integration with existing systems.',
    cover: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['AI', 'NLP', 'Machine Learning'],
    category: 'ai',
    tech: ['Python', 'TensorFlow', 'OpenAI', 'FastAPI', 'Redis'],
    client: 'AI Solutions Inc',
    year: 2024,
    liveUrl: 'https://ai-chat-demo.com',
    githubUrl: 'https://github.com/neetrino/ai-chat-assistant',
    caseStudyUrl: '/case-studies/ai-chat-assistant',
    featured: true
  },
  {
    id: '4',
    title: 'Corporate Website',
    slug: 'corporate-website',
    summary: 'Modern corporate website with CMS integration and multilingual support',
    description: 'A professional corporate website featuring a custom CMS, multilingual support, SEO optimization, and responsive design. Includes blog functionality, contact forms, and analytics integration.',
    cover: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['Corporate', 'CMS', 'SEO'],
    category: 'corporate',
    tech: ['Next.js', 'Tailwind CSS', 'Strapi', 'Framer Motion'],
    client: 'GlobalCorp',
    year: 2023,
    liveUrl: 'https://globalcorp.com',
    githubUrl: 'https://github.com/neetrino/corporate-website',
    featured: false
  },
  {
    id: '5',
    title: 'Analytics Dashboard',
    slug: 'analytics-dashboard',
    summary: 'Real-time analytics dashboard with interactive charts and data visualization',
    description: 'A comprehensive analytics dashboard providing real-time insights with interactive charts, customizable widgets, and advanced filtering options. Features include data export, scheduled reports, and team collaboration tools.',
    cover: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['Analytics', 'Data Visualization', 'Real-time'],
    category: 'dashboards',
    tech: ['React', 'D3.js', 'Node.js', 'WebSocket', 'PostgreSQL'],
    client: 'DataCorp',
    year: 2024,
    liveUrl: 'https://analytics-dashboard.com',
    githubUrl: 'https://github.com/neetrino/analytics-dashboard',
    caseStudyUrl: '/case-studies/analytics-dashboard',
    featured: true
  },
  {
    id: '6',
    title: 'Neetrino Demo Platform',
    slug: 'neetrino-demo-platform',
    summary: 'Demo showcase platform with advanced search and filtering capabilities',
    description: 'A comprehensive demo platform featuring advanced search algorithms, intelligent filtering, and seamless user experience. Built with modern technologies and optimized for performance.',
    cover: {
      url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['Platform', 'Search', 'Filtering'],
    category: 'web',
    tech: ['Next.js', 'NestJS', 'PostgreSQL', 'Elasticsearch'],
    client: 'Neetrino',
    year: 2024,
    liveUrl: 'https://neetrino-demo.com',
    githubUrl: 'https://github.com/neetrino/demo-platform',
    caseStudyUrl: '/case-studies/neetrino-demo',
    featured: true
  },
  {
    id: '7',
    title: 'Mobile E-Learning App',
    slug: 'mobile-elearning-app',
    summary: 'Cross-platform mobile app for online education with interactive features',
    description: 'A comprehensive e-learning mobile application featuring video streaming, interactive quizzes, progress tracking, and offline content access. Available for iOS and Android with synchronized learning progress.',
    cover: {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['Education', 'Mobile', 'Video Streaming'],
    category: 'mobile',
    tech: ['React Native', 'Firebase', 'AWS S3', 'WebRTC'],
    client: 'EduTech',
    year: 2023,
    liveUrl: 'https://apps.apple.com/edutech',
    githubUrl: 'https://github.com/neetrino/elearning-app',
    caseStudyUrl: '/case-studies/elearning-app',
    featured: false
  },
  {
    id: '8',
    title: 'AI-Powered Analytics Dashboard',
    slug: 'ai-analytics-dashboard',
    summary: 'Real-time analytics dashboard with machine learning insights and predictions',
    description: 'An advanced analytics platform combining real-time data visualization with AI-powered insights and predictive analytics. Features include anomaly detection, trend analysis, and automated reporting.',
    cover: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['AI', 'Analytics', 'Machine Learning'],
    category: 'ai',
    tech: ['Python', 'TensorFlow', 'React', 'D3.js', 'Apache Kafka'],
    client: 'AI Analytics Corp',
    year: 2024,
    liveUrl: 'https://ai-analytics-demo.com',
    githubUrl: 'https://github.com/neetrino/ai-analytics-dashboard',
    caseStudyUrl: '/case-studies/ai-analytics',
    featured: true
  },
  {
    id: '9',
    title: 'E-commerce Mobile App',
    slug: 'ecommerce-mobile-app',
    summary: 'Native mobile e-commerce app with AR product visualization',
    description: 'A feature-rich mobile e-commerce application with augmented reality product visualization, secure payment processing, and personalized shopping experience. Includes push notifications and social sharing features.',
    cover: {
      url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['E-commerce', 'Mobile', 'AR'],
    category: 'mobile',
    tech: ['React Native', 'ARCore', 'Stripe', 'Firebase'],
    client: 'ShopTech',
    year: 2024,
    liveUrl: 'https://apps.apple.com/shoptech',
    githubUrl: 'https://github.com/neetrino/ecommerce-mobile',
    caseStudyUrl: '/case-studies/ecommerce-mobile',
    featured: false
  },
  {
    id: '10',
    title: 'Corporate Dashboard',
    slug: 'corporate-dashboard',
    summary: 'Executive dashboard with KPI tracking and business intelligence',
    description: 'A comprehensive executive dashboard providing real-time KPI tracking, business intelligence insights, and automated reporting. Features include role-based access control and customizable widgets.',
    cover: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['Corporate', 'KPI', 'Business Intelligence'],
    category: 'dashboards',
    tech: ['Vue.js', 'D3.js', 'Node.js', 'MongoDB'],
    client: 'Enterprise Corp',
    year: 2023,
    liveUrl: 'https://corporate-dashboard.com',
    githubUrl: 'https://github.com/neetrino/corporate-dashboard',
    featured: false
  },
  {
    id: '11',
    title: 'AI Content Generator',
    slug: 'ai-content-generator',
    summary: 'AI-powered content generation platform with multiple output formats',
    description: 'An advanced AI platform that generates high-quality content in multiple formats including articles, social media posts, and marketing copy. Features include brand voice customization and content optimization.',
    cover: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['AI', 'Content Generation', 'NLP'],
    category: 'ai',
    tech: ['Python', 'OpenAI', 'FastAPI', 'React', 'PostgreSQL'],
    client: 'ContentAI',
    year: 2024,
    liveUrl: 'https://ai-content-generator.com',
    githubUrl: 'https://github.com/neetrino/ai-content-generator',
    caseStudyUrl: '/case-studies/ai-content-generator',
    featured: true
  },
  {
    id: '12',
    title: 'Web Development Agency Site',
    slug: 'web-dev-agency-site',
    summary: 'Modern agency website with portfolio showcase and client testimonials',
    description: 'A professional agency website featuring an interactive portfolio, client testimonials, service descriptions, and contact forms. Built with performance optimization and SEO best practices.',
    cover: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
      width: 800,
      height: 600,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    tags: ['Agency', 'Portfolio', 'SEO'],
    category: 'corporate',
    tech: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Sanity CMS'],
    client: 'WebDev Agency',
    year: 2023,
    liveUrl: 'https://webdev-agency.com',
    githubUrl: 'https://github.com/neetrino/agency-website',
    featured: false
  }
];

export const categories = [
  { id: 'all', label: 'All Projects', count: projects.length },
  { id: 'web', label: 'Web Development', count: projects.filter(p => p.category === 'web').length },
  { id: 'mobile', label: 'Mobile Apps', count: projects.filter(p => p.category === 'mobile').length },
  { id: 'ai', label: 'AI Solutions', count: projects.filter(p => p.category === 'ai').length },
  { id: 'ecommerce', label: 'E-commerce', count: projects.filter(p => p.category === 'ecommerce').length },
  { id: 'dashboards', label: 'Dashboards', count: projects.filter(p => p.category === 'dashboards').length },
  { id: 'corporate', label: 'Corporate', count: projects.filter(p => p.category === 'corporate').length },
];

export const technologies = [
  'Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'TensorFlow', 'OpenAI',
  'React Native', 'PostgreSQL', 'MongoDB', 'Firebase', 'Stripe', 'Tailwind CSS',
  'Framer Motion', 'D3.js', 'FastAPI', 'NestJS', 'Elasticsearch', 'Redis',
  'AWS S3', 'WebRTC', 'ARCore', 'JWT', 'Biometric', 'Apache Kafka'
];

export const featuredProjects = projects.filter(project => project.featured);
