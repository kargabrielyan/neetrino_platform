'use client';

import { useState } from 'react';
import { type Locale } from '../../lib/i18n';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

export default function Blog() {
  const [locale, setLocale] = useState<Locale>('hy');

  const posts = [
    {
      id: 1,
      title: 'Введение в машинное обучение для веб-разработчиков',
      excerpt: 'Изучаем основы ML и как интегрировать AI в веб-приложения',
      content: 'Полное руководство по машинному обучению...',
      author: 'Արամ Մկրտչյան',
      date: '2024-01-15',
      category: 'AI',
      image: '/api/placeholder/400/250',
      readTime: '5 мин',
    },
    {
      id: 2,
      title: 'Современные тренды в веб-дизайне 2024',
      excerpt: 'Обзор новых подходов и технологий в веб-дизайне',
      content: 'Анализ современных трендов...',
      author: 'Սարա Ջոնսոն',
      date: '2024-01-12',
      category: 'Design',
      image: '/api/placeholder/400/250',
      readTime: '3 мин',
    },
    {
      id: 3,
      title: 'Оптимизация производительности React приложений',
      excerpt: 'Практические советы по улучшению скорости загрузки',
      content: 'Детальное руководство по оптимизации...',
      author: 'Միքայել Պետրոսյան',
      date: '2024-01-10',
      category: 'Development',
      image: '/api/placeholder/400/250',
      readTime: '7 мин',
    },
  ];

  const categories = ['Все', 'AI', 'Design', 'Development', 'Business'];

  return (
    <main className="min-h-screen bg-bg">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Блог</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Последние новости, статьи и insights из мира технологий
          </p>
        </div>

        {/* Фильтры категорий */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white/5 text-white/70 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Сетка статей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors group"
            >
              {/* Изображение статьи */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-white/50 text-sm">Article Image</span>
              </div>
              
              {/* Контент статьи */}
              <div className="p-6">
                {/* Мета информация */}
                <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {post.category}
                  </div>
                </div>
                
                {/* Заголовок */}
                <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                {/* Краткое описание */}
                <p className="text-white/70 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                {/* Время чтения и ссылка */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">{post.readTime} чтения</span>
                  <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                    Читать далее
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Пагинация */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              Назад
            </button>
            <button className="px-3 py-2 bg-primary text-black rounded-lg font-medium">
              1
            </button>
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              2
            </button>
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              3
            </button>
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              Далее
            </button>
          </div>
        </div>

        {/* Подписка на новости */}
        <div className="mt-16">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Подпишитесь на новости</h2>
            <p className="text-white/70 mb-6">
              Получайте последние статьи и новости прямо на почту
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
              />
              <button className="px-6 py-2 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Подписаться
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
