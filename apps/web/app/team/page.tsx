'use client';

import Head from 'next/head';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import { useMounted } from '../../lib/use-mounted';

const team = [
  { name: 'Alex Johnson', role: 'CEO & Founder', image: '/team/alex.jpg' },
  { name: 'Sarah Chen', role: 'CTO', image: '/team/sarah.jpg' },
  { name: 'Mike Rodriguez', role: 'Lead Designer', image: '/team/mike.jpg' },
  { name: 'Emma Wilson', role: 'Head of Marketing', image: '/team/emma.jpg' }
];

export default function Team() {
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
    <>
      <Head>
        <title>Our Team - Neetrino Platform</title>
        <meta name="description" content="Meet the talented individuals who make our vision a reality. Our team of experts is dedicated to delivering exceptional digital solutions." />
        <meta property="og:title" content="Our Team - Neetrino Platform" />
        <meta property="og:description" content="Meet the talented individuals who make our vision a reality. Our team of experts is dedicated to delivering exceptional digital solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://co.neetrino.com/team" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Team - Neetrino Platform" />
        <meta name="twitter:description" content="Meet the talented individuals who make our vision a reality. Our team of experts is dedicated to delivering exceptional digital solutions." />
      </Head>
      <Layout>
        <div className="min-h-screen bg-white dark:bg-black">
          {/* Hero Section */}
          <section className="pt-20 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Meet Our Team
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  The talented individuals who make our vision a reality
                </p>
              </motion.div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto"
              >
                {team.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl group-hover:scale-105 transition-transform duration-300">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {member.role}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}











