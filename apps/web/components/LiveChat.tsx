'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Mail, 
  Phone,
  MessageSquare,
  Send
} from 'lucide-react';

interface ChatOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgColor: string;
}

const chatOptions: ChatOption[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    href: 'https://wa.me/37444343000',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10 hover:bg-green-500/20',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: Send,
    href: 'https://t.me/neetrino',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
  },
  {
    id: 'messenger',
    label: 'Messenger',
    icon: MessageSquare,
    href: 'https://m.me/neetrino',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10 hover:bg-blue-600/20',
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    href: 'mailto:info@neetrino.com',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: Phone,
    href: 'tel:+37444343000',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
  },
];

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 glass rounded-2xl p-4 shadow-2xl min-w-[280px]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">Contact Us</h3>
              <button
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-white/10 transition-colors focus-ring"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-ink/70" />
              </button>
            </div>
            
            <p className="text-sm text-ink/70 mb-4">
              Choose your preferred way to reach us
            </p>

            <div className="space-y-2">
              {chatOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.a
                    key={option.id}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${option.bgColor} transition-all duration-200 focus-ring group`}
                  >
                    <div className={`p-2 rounded-lg ${option.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${option.color}`} />
                    </div>
                    <span className="text-ink font-medium">{option.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full glass-strong flex items-center justify-center shadow-lg focus-ring transition-all duration-200 ${
          isOpen ? 'bg-a1 text-white' : 'bg-a1 text-white hover:bg-a1/90'
        }`}
        aria-label="Open live chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

