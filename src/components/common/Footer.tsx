// src/components/common/Footer.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaChevronDown,
  FaChevronRight,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaPaypal,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeadset,
  FaArrowUp,
  FaCheckCircle,
  FaBolt,
  FaGraduationCap,
  FaLaptop,
  FaMobileAlt,
  FaTabletAlt,
  FaHeadphones,
  FaTools,
  FaExchangeAlt,
  FaBriefcase,
} from 'react-icons/fa';
import { FiSend, FiCheck } from 'react-icons/fi';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  isNew?: boolean;
}

interface FooterSection {
  title: string;
  icon?: React.ElementType;
  links: FooterLink[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const shopLinks: FooterLink[] = [
  { label: 'Laptops', href: '/laptops' },
  { label: 'Phones', href: '/phones' },
  { label: 'iPads & Tablets', href: '/tablets' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Student Deals', href: '/student-deals', badge: 'New', isNew: true },
  { label: 'Business Laptops', href: '/business-laptops' },
];

const servicesLinks: FooterLink[] = [
  { label: 'Phone Repairs', href: '/repairs/phone' },
  { label: 'Laptop Repairs', href: '/repairs/laptop' },
  { label: 'Screen Replacement', href: '/repairs/screen' },
  { label: 'Battery Replacement', href: '/repairs/battery' },
  { label: 'Data Recovery', href: '/repairs/data-recovery' },
  { label: 'Trade-In', href: '/trade-in' },
];

const helpLinks: FooterLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Delivery', href: '/delivery' },
  { label: 'Returns', href: '/returns' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' },
];

const businessLinks: FooterLink[] = [
  { label: 'Business Laptops', href: '/business/laptops' },
  { label: 'Bulk Orders', href: '/business/bulk-orders' },
  { label: 'IT Services', href: '/business/it-services' },
  { label: 'Business Trade-In', href: '/business/trade-in' },
];

const socialLinks = [
  { icon: FaFacebookF, href: 'https://facebook.com/fixtoday', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: FaInstagram, href: 'https://instagram.com/fixtoday', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: FaTiktok, href: 'https://tiktok.com/@fixtoday', label: 'TikTok', color: 'hover:bg-black' },
  { icon: FaYoutube, href: 'https://youtube.com/@fixtoday', label: 'YouTube', color: 'hover:bg-red-600' },
];

const paymentMethods = [
  { icon: FaCcVisa, label: 'Visa' },
  { icon: FaCcMastercard, label: 'Mastercard' },
  { icon: FaCcAmex, label: 'American Express' },
  { icon: FaCcDiscover, label: 'Discover' },
  { icon: FaPaypal, label: 'PayPal' },
];

// ─── Newsletter Form ──────────────────────────────────────────────────────────

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isSubscribed}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 min-w-[140px] ${
            isSubscribed
              ? 'bg-emerald-500 text-white cursor-default'
              : isSubmitting
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]'
          }`}
        >
          {isSubscribed ? (
            <>
              <FiCheck className="text-sm" />
              <span>Subscribed!</span>
            </>
          ) : isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <>
              <FiSend className="text-sm" />
              <span>Subscribe</span>
            </>
          )}
        </button>
      </div>
      {isSubscribed && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-emerald-600 flex items-center space-x-1"
        >
          <FaCheckCircle className="text-[10px]" />
          <span>Welcome! Get £10 OFF your first purchase — check your inbox.</span>
        </motion.p>
      )}
      <p className="mt-2 text-[10px] text-gray-400">
        Get £10 OFF your first purchase when you join our email list. By subscribing, you agree to our{' '}
        <Link href="/privacy-policy" className="text-blue-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

// ─── Back to Top ──────────────────────────────────────────────────────────────

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          aria-label="Back to top"
        >
          <FaArrowUp className="text-sm" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  const footerSections: FooterSection[] = [
    { title: 'Shop', links: shopLinks },
    { title: 'Services', links: servicesLinks },
    { title: 'Help', links: helpLinks },
    { title: 'For Business', links: businessLinks },
  ];

  return (
    <>
      <BackToTop />

      <footer className="bg-white border-t border-gray-200">
        {/* ─── Trust Badges ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: FaTruck, label: 'Free Delivery', desc: 'On orders over £50' },
                { icon: FaUndo, label: '14-Day Returns', desc: 'Hassle-free returns' },
                { icon: FaShieldAlt, label: 'Warranty Included', desc: 'On all refurbished tech' },
                { icon: FaTools, label: 'Expert Repairs', desc: 'In-store & mail-in' },
              ].map((badge, index) => (
                <div key={index} className="flex items-center space-x-3 text-white">
                  <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
                    <badge.icon className="text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{badge.label}</p>
                    <p className="text-[10px] text-blue-100">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Brand + Link Columns ─────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <FaBolt className="text-white text-lg" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Fix<span className="text-blue-600">Today</span> Tech
                </span>
              </Link>

              <p className="text-sm font-semibold text-gray-800">
                Refurbished Tech • Repairs • Trade-In
              </p>

              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Quality tech. Better prices. Buy, sell, trade and repair laptops, phones and tablets — 
                with warranty included on all refurbished devices.
              </p>

              {/* Contact Info */}
              <div className="space-y-2.5">
                <a
                  href="mailto:support@fixtoday.co.uk"
                  className="flex items-center space-x-3 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <FaEnvelope className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span>support@fixtoday.co.uk</span>
                </a>
                <a
                  href="tel:+441234567890"
                  className="flex items-center space-x-3 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <FaPhoneAlt className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span>+44 (0) 123 456 7890</span>
                </a>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaMapMarkerAlt className="text-xs text-gray-500" />
                  </div>
                  <span>Birtley, County Durham</span>
                </div>
              </div>
            </div>

            {/* Desktop Link Columns */}
            <div className="hidden lg:grid lg:col-span-8 lg:grid-cols-4 gap-6">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group flex items-center space-x-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <FaChevronRight className="text-[7px] text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                          <span>{link.label}</span>
                          {link.badge && (
                            <span
                              className={`px-1.5 py-0.5 text-[8px] font-bold rounded-full uppercase ${
                                link.isNew
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-rose-100 text-rose-600'
                              }`}
                            >
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Accordion */}
          <div className="lg:hidden mt-8 space-y-2">
            {footerSections.map((section) => {
              const isOpen = openMobileSection === section.title;
              return (
                <div key={section.title} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenMobileSection(isOpen ? null : section.title)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50"
                  >
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      {section.title}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <FaChevronDown className="text-xs text-gray-400" />
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
                        <ul className="p-4 space-y-3 bg-white">
                          {section.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                <FaChevronRight className="text-[7px] text-gray-300 flex-shrink-0" />
                                <span>{link.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Student Discount Band ────────────────────────────────────────── */}
        <div className="border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    🎓 Student Discount
                  </h3>
                  <p className="text-sm text-gray-600">
                    Show your student ID and unlock exclusive prices on laptops, phones, tablets, accessories and repairs.
                  </p>
                </div>
              </div>
              <Link
                href="/student-deals"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex-shrink-0"
              >
                <FaGraduationCap className="text-sm" />
                <span>Get Student Discount</span>
                <FaChevronRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Newsletter + Social ──────────────────────────────────────────── */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Newsletter */}
              <div className="flex-1 max-w-lg">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Get the Best Tech Deals First
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Be the first to know about new refurbished laptops, phones, tablets and exclusive offers.
                </p>
                <NewsletterForm />
              </div>

              {/* Social */}
              <div className="lg:text-right">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`p-2.5 bg-gray-100 text-gray-500 rounded-lg transition-all duration-200 hover:text-white hover:scale-110 ${social.color}`}
                    >
                      <social.icon className="text-sm" />
                    </a>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 lg:justify-end flex-wrap">
                  <Link href="/trade-in" className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                    Sell Your Device
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/trade-in" className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                    Trade In
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/contact" className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Payment + Bottom Bar ─────────────────────────────────────────── */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 flex-wrap justify-center">
                <span className="text-xs text-gray-400 font-medium">We Accept:</span>
                {paymentMethods.map((method) => (
                  <div
                    key={method.label}
                    className="p-1.5 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                    title={method.label}
                  >
                    <method.icon className="text-xl text-gray-500" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <p className="text-xs text-gray-400">
                  © {currentYear} FixToday Tech. All rights reserved.
                </p>
                <div className="flex items-center space-x-4">
                  <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
                    Privacy
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/terms-of-service" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
                    Terms
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/cookie-policy" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
                    Cookies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}