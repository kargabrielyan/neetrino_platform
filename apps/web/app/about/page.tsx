'use client';

import { useState } from 'react';
import { type Locale } from '../../lib/i18n';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Users, Target, Award, Lightbulb } from 'lucide-react';

export default function About() {
  const [locale, setLocale] = useState<Locale>('hy');

  const team = [
    {
      name: 'Արամ Մկրտչյան',
      role: 'CEO & Founder',
      image: '/api/placeholder/200/200',
    },
    {
      name: 'Սարա Ջոնսոն',
      role: 'CTO',
      image: '/api/placeholder/200/200',
    },
    {
      name: 'Միքայել Պետրոսյան',
      role: 'Lead Developer',
      image: '/api/placeholder/200/200',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Целеустремленность',
      description: 'Мы всегда стремимся к достижению лучших результатов для наших клиентов',
    },
    {
      icon: Lightbulb,
      title: 'Инновации',
      description: 'Используем передовые технологии и креативные решения',
    },
    {
      icon: Users,
      title: 'Команда',
      description: 'Наша команда - это наша сила и основа успеха',
    },
    {
      icon: Award,
      title: 'Качество',
      description: 'Обеспечиваем высокое качество во всех наших проектах',
    },
  ];

  return (
    <main className="min-h-screen bg-bg">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">О компании</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Neetrino - это инновационная IT компания, специализирующаяся на создании 
            современных веб-решений с использованием искусственного интеллекта
          </p>
        </div>

        {/* О компании */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Наша история</h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Основанная в 2020 году, Neetrino быстро стала ведущей IT компанией 
                  в Армении. Мы специализируемся на разработке веб-приложений, 
                  мобильных приложений и интеграции AI решений.
                </p>
                <p>
                  Наша команда состоит из опытных разработчиков, дизайнеров и 
                  специалистов по машинному обучению, которые работают вместе 
                  для создания инновационных продуктов.
                </p>
                <p>
                  Мы гордимся тем, что помогаем нашим клиентам достигать их целей 
                  с помощью передовых технологий и креативных решений.
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Наши достижения</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/80">50+ успешных проектов</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/80">30+ довольных клиентов</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/80">5 лет опыта</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/80">100% качество</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ценности */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Наши ценности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-white/70 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Команда */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Наша команда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white/50 text-sm">Photo</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Готовы начать проект?</h2>
            <p className="text-white/70 mb-6">
              Свяжитесь с нами для обсуждения вашего проекта
            </p>
            <button className="px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Связаться с нами
            </button>
          </div>
        </section>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
