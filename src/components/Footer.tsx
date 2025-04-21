import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Heart,
  ArrowUp
} from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Guidelines', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Support', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Code of Conduct', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Github, href: '#' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Code2 className="h-10 w-10 text-red-800" />
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-900">
                Vosa Tech
              </span>
            </motion.div>
            <motion.p 
              className="mt-4 text-gray-600 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join the most innovative hackathon platform where ideas transform into reality. 
              Connect with brilliant minds and shape the future of technology.
            </motion.p>
            <motion.div 
              className="mt-6 flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-red-800 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (categoryIndex + 1) }}
            >
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={link.href} className="text-gray-600 hover:text-red-800 transition-colors duration-200">
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              className="flex items-center text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by Vosa Tech Team
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Vosa Tech. All rights reserved.
              </span>
              <motion.button
                onClick={scrollToTop}
                className="p-2 rounded-full bg-red-50 text-red-800 hover:bg-red-100 transition-colors duration-200"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}