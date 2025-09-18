'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const posts = [
    {
      id: 1,
      title: 'Introduction to Machine Learning for Web Developers',
      excerpt: 'Learn the basics of ML and how to integrate AI into web applications',
      content: 'Полное руководство по машинному обучению...',
      author: 'Արամ Մկրտչյան',
      date: '2024-01-15',
      category: 'AI',
      image: '/api/placeholder/400/250',
      readTime: '5 min',
    },
    {
      id: 2,
      title: 'Modern Web Design Trends 2024',
      excerpt: 'Overview of new approaches and technologies in web design',
      content: 'Анализ современных трендов...',
      author: 'Սարա Ջոնսոն',
      date: '2024-01-12',
      category: 'Design',
      image: '/api/placeholder/400/250',
      readTime: '3 min',
    },
    {
      id: 3,
      title: 'React Application Performance Optimization',
      excerpt: 'Practical tips for improving loading speed',
      content: 'Детальное руководство по оптимизации...',
      author: 'Միքայել Պետրոսյան',
      date: '2024-01-10',
      category: 'Development',
      image: '/api/placeholder/400/250',
      readTime: '7 min',
    },
  ];

  const categories = ['All', 'AI', 'Design', 'Development', 'Business'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="glass p-8 rounded-3xl">
            <h1 className="text-4xl font-bold text-ink mb-4">Blog</h1>
            <p className="text-xl text-ink/70 max-w-2xl mx-auto">
              Latest news, articles and insights from the world of technology
            </p>
          </div>
        </div>

        {/* Фильтры категорий */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 focus-ring ${
                activeCategory === category
                  ? 'glass-strong text-ink'
                  : 'glass text-ink/70 hover:text-ink hover:glass-strong'
              }`}
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
              className="glass rounded-3xl overflow-hidden hover:glass-strong transition-all duration-200 group focus-ring"
            >
              {/* Изображение статьи */}
              <div className="h-48 bg-a1/10 flex items-center justify-center">
                <span className="text-ink/50 text-sm">Article Image</span>
              </div>
              
              {/* Контент статьи */}
              <div className="p-6">
                {/* Мета информация */}
                <div className="flex items-center gap-4 text-sm text-ink/60 mb-3">
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
                <h2 className="text-xl font-semibold text-ink mb-3 group-hover:text-a1 transition-colors">
                  {post.title}
                </h2>
                
                {/* Краткое описание */}
                <p className="text-ink/70 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                {/* Время чтения и ссылка */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink/50">{post.readTime} read</span>
                  <button className="flex items-center gap-1 text-a1 hover:text-a1/80 transition-colors text-sm font-medium focus-ring rounded-lg p-1">
                    Read More
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
            <button className="px-3 py-2 text-ink/50 hover:text-ink transition-colors focus-ring rounded-lg">
              Previous
            </button>
            <button className="px-3 py-2 glass-strong text-ink rounded-full font-medium focus-ring">
              1
            </button>
            <button className="px-3 py-2 text-ink/50 hover:text-ink transition-colors focus-ring rounded-lg">
              2
            </button>
            <button className="px-3 py-2 text-ink/50 hover:text-ink transition-colors focus-ring rounded-lg">
              3
            </button>
            <button className="px-3 py-2 text-ink/50 hover:text-ink transition-colors focus-ring rounded-lg">
              Next
            </button>
          </div>
        </div>

        {/* Подписка на новости */}
        <div className="mt-16">
          <div className="glass p-8 rounded-3xl text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Subscribe to Newsletter</h2>
            <p className="text-ink/70 mb-6">
              Get the latest articles and news delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 glass-subtle rounded-full text-ink placeholder-ink/50 focus-ring"
              />
              <button className="px-6 py-2 glass-strong text-ink rounded-full font-semibold hover:glass transition-all duration-200 focus-ring">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
