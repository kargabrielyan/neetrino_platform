'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

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
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="glass p-8 rounded-3xl">
            <h1 className="text-4xl font-bold text-ink mb-4">Contact Us</h1>
            <p className="text-xl text-ink/70 max-w-2xl mx-auto">
              Ready to start a project? Let's discuss your ideas and create something amazing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Контактная информация */}
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-ink mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              {/* Адрес */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-a1/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-a1" />
                </div>
                <div>
                  <h3 className="text-ink font-semibold mb-1">Address</h3>
                  <p className="text-ink/70">
                    Yerevan, Armenia<br />
                    Example Street, 123
                  </p>
                </div>
              </div>

              {/* Телефон */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-a1/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-a1" />
                </div>
                <div>
                  <h3 className="text-ink font-semibold mb-1">Phone</h3>
                  <p className="text-ink/70">
                    <a href="tel:+37444343000" className="hover:text-ink transition-colors">
                      +374 44 343 000
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-a1/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-a1" />
                </div>
                <div>
                  <h3 className="text-ink font-semibold mb-1">Email</h3>
                  <p className="text-ink/70">
                    <a href="mailto:info@neetrino.com" className="hover:text-ink transition-colors">
                      info@neetrino.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Часы работы */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-a1/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-a1" />
                </div>
                <div>
                  <h3 className="text-ink font-semibold mb-1">Working Hours</h3>
                  <p className="text-ink/70">
                    Monday - Friday: 09:00 - 18:00<br />
                    Saturday: 10:00 - 16:00<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Социальные сети */}
            <div className="mt-8">
              <h3 className="text-ink font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Facebook className="w-5 h-5 text-ink/70" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Instagram className="w-5 h-5 text-ink/70" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Linkedin className="w-5 h-5 text-ink/70" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                  <MessageCircle className="w-5 h-5 text-ink/70" />
                </a>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-ink mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-ink/70 text-sm mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-full text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-ink/70 text-sm mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-full text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-ink/70 text-sm mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 glass rounded-full text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-ink/70 text-sm mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 glass rounded-2xl text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 glass-strong rounded-full text-ink font-semibold hover:bg-white/10 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Карта (заглушка) */}
        <div className="mt-16">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-ink mb-6 text-center">Find Us</h2>
            <div className="glass rounded-2xl h-64 flex items-center justify-center">
              <span className="text-ink/50">Map will be here</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
