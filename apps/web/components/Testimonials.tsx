'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useMounted } from '../lib/use-mounted';

const testimonials = [
  {
    name: 'Aram Mkrtchyan',
    company: 'TechCorp Armenia',
    role: 'CEO',
    content: 'Neetrino\'s AI solutions have transformed our business. Their technologies have allowed us to increase efficiency by 300%.',
    rating: 5,
    avatar: 'AM',
  },
  {
    name: 'Sarah Johnson',
    company: 'InnovateLab',
    role: 'CTO',
    content: 'The machine learning models provided by Neetrino are incredibly accurate and have revolutionized our data processing capabilities.',
    rating: 5,
    avatar: 'SJ',
  },
];

export default function Testimonials() {
  const isMounted = useMounted();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-white mb-4">
            Client Testimonials
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            See what our clients say about our AI solutions and services
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0,209,255,0.1)'
              }}
              className="glass rounded-2xl p-8 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-primary/30" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 leading-relaxed mb-6 text-lg">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-white/60 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}