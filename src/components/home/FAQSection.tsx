// src/components/home/FAQSection.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronDown,
  FaChevronRight,
  FaStar,
  FaQuestionCircle,
  FaTruck,
  FaUndo,
  FaCreditCard,
  FaShieldAlt,
  FaHeadset,
  FaBoxOpen,
} from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
  category: string;
}

const faqItems: FAQItem[] = [
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
];

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
              className={`text-sm font-semibold transition-colors block truncate ${
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

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const displayedItems = showAll ? faqItems : faqItems.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 mb-3">
          <FaQuestionCircle className="text-blue-600 text-xs" />
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Frequently Asked Questions
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Got Questions? We've Got Answers
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Find quick answers to the most common questions about shopping with FixToday. 
          Can't find what you're looking for? Our support team is here to help.
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayedItems.map((item, index) => (
          <FAQAccordionItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {!showAll && faqItems.length > 6 && (
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <span>Show All FAQs</span>
            <FaChevronDown className="text-xs" />
          </button>
        )}
        <Link
          href="/faqs"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-blue-600 text-sm font-semibold rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <span>Visit FAQ Page</span>
          <FaChevronRight className="text-xs" />
        </Link>
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
    </section>
  );
}