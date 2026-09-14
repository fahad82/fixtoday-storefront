// src/app/faqs/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronDown,
  FaChevronRight,
  FaQuestionCircle,
  FaTruck,
  FaUndo,
  FaCreditCard,
  FaShieldAlt,
  FaHeadset,
  FaBoxOpen,
  FaUserCheck,
  FaSyncAlt,
  FaSearch,
} from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
  category: string;
}

const allFaqs: FAQItem[] = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days delivery. All orders over £50 qualify for free standard shipping. International orders typically arrive within 7-14 business days.',
    icon: FaTruck,
    category: 'Shipping',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day hassle-free return policy. Items must be unused and in original packaging. Refunds are processed within 5-7 business days of receiving your return. Free return shipping is provided for defective items.',
    icon: FaUndo,
    category: 'Returns',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with 256-bit SSL encryption for your peace of mind.',
    icon: FaCreditCard,
    category: 'Payment',
  },
  {
    question: 'Are your products covered by warranty?',
    answer: 'All products come with a minimum 1-year manufacturer warranty. Many of our premium items include extended 2-year coverage. Warranty details are listed on each product page. Contact our support team for warranty claims.',
    icon: FaShieldAlt,
    category: 'Warranty',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order anytime through your account dashboard or our Order Tracking page. Real-time updates are provided for all shipments.',
    icon: FaBoxOpen,
    category: 'Orders',
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes! Our dedicated customer support team is available 24/7 to assist you. Reach us via email at support@fixtoday.co.uk, call us at +44 (0) 123 456 7890, or use our live chat feature on the website.',
    icon: FaHeadset,
    category: 'Support',
  },
  {
    question: 'Can I change or cancel my order?',
    answer: 'Orders can be changed or cancelled within 1 hour of placement, provided they have not yet been processed for shipping. Please contact our support team immediately if you need to make changes to your order.',
    icon: FaUndo,
    category: 'Orders',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Customs fees and import duties may apply depending on your location and are the responsibility of the recipient.',
    icon: FaTruck,
    category: 'Shipping',
  },
  {
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the top navigation bar. You can register using your email address or sign up with Google or Facebook. Creating an account allows you to track orders, save wishlists, and enjoy faster checkout.',
    icon: FaUserCheck,
    category: 'Account',
  },
  {
    question: 'What if my item arrives damaged?',
    answer: 'If your item arrives damaged, please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or full refund, including return shipping costs. Your satisfaction is our priority.',
    icon: FaSyncAlt,
    category: 'Returns',
  },
];

const categories = ['All', 'Shipping', 'Returns', 'Payment', 'Warranty', 'Orders', 'Support', 'Account'];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-blue-200 bg-blue-50/50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              isOpen ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <item.icon
              className={`text-sm transition-colors ${
                isOpen ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
          </div>
          <div className="min-w-0">
            <span
              className={`text-sm font-semibold transition-colors block ${
                isOpen ? 'text-blue-700' : 'text-gray-800'
              }`}
            >
              {item.question}
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {item.category}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <FaChevronDown
            className={`text-xs transition-colors ${
              isOpen ? 'text-blue-600' : 'text-gray-400'
            }`}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-4 pb-4 pl-16">
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <nav className="flex items-center space-x-2 text-xs text-blue-100 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <FaChevronRight className="text-[8px]" />
              <span className="text-white font-medium">FAQs</span>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm">
                <FaQuestionCircle className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Frequently Asked Questions
                </h1>
                <p className="text-sm text-blue-100 mt-1">
                  Find answers to common questions about shopping with FixToday
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Search & Filter */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQs..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, index) => (
                <FAQAccordionItem
                  key={index}
                  item={item}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <FaQuestionCircle className="text-4xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  No results found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm">
                  <FaHeadset className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Still have questions?
                  </h3>
                  <p className="text-sm text-blue-100">
                    Our support team is available 24/7 to assist you.
                  </p>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex-shrink-0"
              >
                <span>Contact Support</span>
                <FaChevronRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}