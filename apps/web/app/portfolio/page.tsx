'use client';

import { useState } from 'react';
import { type Locale } from '../../lib/i18n';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ExternalLink, Github, Eye } from 'lucide-react';

export default function Portfolio() {
  const [locale, setLocale] = useState<Locale>('hy');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Все проекты' },
    { id: 'web', label: 'Веб-разработка' },
    { id: 'mobile', label: 'Мобильные приложения' },
    { id: 'ai', label: 'AI решения' },
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Современная платформа для онлайн-торговли с интеграцией AI',
      category: 'web',
      image: '/api/placeholder/400/300',
      technologies: ['React', 'Node.js', 'AI'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      description: 'Безопасное мобильное приложение для банковских операций',
      category: 'mobile',
      image: '/api/placeholder/400/300',
      technologies: ['React Native', 'Node.js', 'Blockchain'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      id: 3,
      title: 'AI Chat Assistant',
      description: 'Интеллектуальный чат-бот с машинным обучением',
      category: 'ai',
      image: '/api/placeholder/400/300',
      technologies: ['Python', 'TensorFlow', 'OpenAI'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      id: 4,
      title: 'Corporate Website',
      description: 'Корпоративный сайт с современным дизайном',
      category: 'web',
      image: '/api/placeholder/400/300',
      technologies: ['Next.js', 'Tailwind', 'Framer Motion'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Наше портфолио</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Посмотрите на наши лучшие проекты и решения, которые мы создали для наших клиентов
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
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
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
                    Посмотреть
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
            <h2 className="text-2xl font-bold text-white mb-4">Заинтересованы в сотрудничестве?</h2>
            <p className="text-white/70 mb-6">
              Давайте обсудим ваш проект и создадим что-то удивительное вместе
            </p>
            <button className="px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Обсудить проект
            </button>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
