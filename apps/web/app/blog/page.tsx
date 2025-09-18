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
          <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Latest news, articles and insights from the world of technology
          </p>
        </div>

        {/* Фильтры категорий */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-black'
                  : 'bg-white text-black hover:bg-white/90'
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
                  <span className="text-sm text-white/50">{post.readTime} read</span>
                  <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
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
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              Previous
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
              Next
            </button>
          </div>
        </div>

        {/* Подписка на новости */}
        <div className="mt-16">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Subscribe to Newsletter</h2>
            <p className="text-white/70 mb-6">
              Get the latest articles and news delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
              />
              <button className="px-6 py-2 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
