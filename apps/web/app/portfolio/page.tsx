'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ExternalLink, Github, Eye } from 'lucide-react';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All project' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Solutions' },
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Modern e-commerce platform with AI integration',
      category: 'web',
      image: '/api/placeholder/400/300',
      technologies: ['React', 'Node.js', 'AI'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application',
      category: 'mobile',
      image: '/api/placeholder/400/300',
      technologies: ['React Native', 'Node.js', 'Blockchain'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      id: 3,
      title: 'AI Chat Assistant',
      description: 'Intelligent chatbot with machine learning',
      category: 'ai',
      image: '/api/placeholder/400/300',
      technologies: ['Python', 'TensorFlow', 'OpenAI'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      id: 4,
      title: 'Corporate Website',
      description: 'Corporate website with modern design',
      category: 'web',
      image: '/api/placeholder/400/300',
      technologies: ['Next.js', 'Tailwind', 'Framer Motion'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    // Добавляем 3 тестовых демо
    {
      id: 5,
      title: 'Neetrino Demo Platform',
      description: 'Demo showcase platform with advanced search and filtering',
      category: 'web',
      image: '/api/placeholder/400/300',
      technologies: ['Next.js', 'NestJS', 'PostgreSQL'],
      liveUrl: 'https://neetrino-demo.com',
      githubUrl: 'https://github.com/neetrino/demo-platform',
    },
    {
      id: 6,
      title: 'AI-Powered Analytics Dashboard',
      description: 'Real-time analytics dashboard with machine learning insights',
      category: 'ai',
      image: '/api/placeholder/400/300',
      technologies: ['React', 'Python', 'TensorFlow'],
      liveUrl: 'https://analytics-demo.com',
      githubUrl: 'https://github.com/neetrino/analytics-dashboard',
    },
    {
      id: 7,
      title: 'Mobile E-Learning App',
      description: 'Cross-platform mobile app for online education',
      category: 'mobile',
      image: '/api/placeholder/400/300',
      technologies: ['React Native', 'Firebase', 'AI'],
      liveUrl: 'https://elearning-demo.com',
      githubUrl: 'https://github.com/neetrino/elearning-app',
    },
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Our Portfolio</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Explore our best projects and solutions we've created for our clients
          </p>
        </div>

        {/* Фильтры категорий */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary text-black'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Сетка проектов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors group"
            >
              {/* Изображение проекта */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                <span className="text-white/50 text-sm">Project Image</span>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Github className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
              
              {/* Контент проекта */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-white/70 mb-4 leading-relaxed">{project.description}</p>
                
                {/* Технологии */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Ссылки */}
                <div className="flex gap-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Interested in Collaboration?</h2>
            <p className="text-white/70 mb-6">
              Let's discuss your project and create something amazing together
            </p>
            <button className="px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Discuss Project
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
