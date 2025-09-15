'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Обработка отправки формы
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Свяжитесь с нами</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Готовы начать проект? Давайте обсудим ваши идеи и создадим что-то удивительное
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Контактная информация */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Контактная информация</h2>
            
            <div className="space-y-6">
              {/* Адрес */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Адрес</h3>
                  <p className="text-white/70">
                    Ереван, Армения<br />
                    ул. Примерная, 123
                  </p>
                </div>
              </div>

              {/* Телефон */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Телефон</h3>
                  <p className="text-white/70">
                    <a href="tel:+37444343000" className="hover:text-primary transition-colors">
                      +374 44 343 000
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-white/70">
                    <a href="mailto:info@neetrino.com" className="hover:text-primary transition-colors">
                      info@neetrino.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Часы работы */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Часы работы</h3>
                  <p className="text-white/70">
                    Понедельник - Пятница: 09:00 - 18:00<br />
                    Суббота: 10:00 - 16:00<br />
                    Воскресенье: Выходной
                  </p>
                </div>
              </div>
            </div>

            {/* Социальные сети */}
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-4">Мы в социальных сетях</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <span className="text-white/70 text-sm">FB</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <span className="text-white/70 text-sm">IG</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <span className="text-white/70 text-sm">LI</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <span className="text-white/70 text-sm">WA</span>
                </a>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Напишите нам</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-white/70 text-sm mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
                    placeholder="Ваше имя"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white/70 text-sm mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-white/70 text-sm mb-2">
                  Тема *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
                  placeholder="Тема сообщения"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white/70 text-sm mb-2">
                  Сообщение *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50 resize-none"
                  placeholder="Расскажите о вашем проекте..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>

        {/* Карта (заглушка) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Как нас найти</h2>
          <div className="bg-white/5 border border-white/10 rounded-lg h-64 flex items-center justify-center">
            <span className="text-white/50">Карта будет здесь</span>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
