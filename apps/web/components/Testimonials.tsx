'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getTranslations, type Locale } from '../lib/i18n';

interface TestimonialsProps {
  locale: Locale;
}

const testimonials = [
  {
    name: 'Արամ Մկրտչյան',
    company: 'TechCorp Armenia',
    role: 'CEO',
    content: 'Neetrino-ի AI լուծումները մեր բիզնեսը փոխակերպել են: Նրանց տեխնոլոգիաները մեզ թույլ են տվել ավելացնել արդյունավետությունը 300%-ով:',
    rating: 5,
    avatar: 'AM',
  },
  {
    name: 'Sarah Johnson',
    company: 'Global Innovations',
    role: 'CTO',
    content: 'The AI integration provided by Neetrino has revolutionized our data processing capabilities. Their neural networks are incredibly accurate and fast.',
    rating: 5,
    avatar: 'SJ',
  },
];

export default function Testimonials({ locale }: TestimonialsProps) {
  const t = getTranslations(locale);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-white mb-4">
            {t.testimonials.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
              className="card-glass relative"
            >
              {/* Иконка кавычек */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-primary/30" />
              </div>

              {/* Рейтинг */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Отзыв */}
              <blockquote className="text-white/90 text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>

              {/* Информация об авторе */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-white/60 text-sm">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 right-20 w-40 h-40 border border-primary/5 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-20 w-28 h-28 border border-accent/5 rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
    </section>
  );
}
