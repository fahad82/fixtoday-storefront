// src/app/contact/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronRight,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaHeadset,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaCommentAlt,
  FaTag,
  FaPaperPlane,
  FaShieldAlt,
  FaTruck,
  FaTools,
  FaGraduationCap,
  FaBriefcase,
  FaMobileAlt,
  FaLaptop,
  FaQuestionCircle,
  FaArrowRight,
} from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const subjectOptions = [
  { value: '', label: 'Select a topic...' },
  { value: 'general', label: 'General Enquiry' },
  { value: 'student', label: '🎓 Student Discount' },
  { value: 'repairs', label: '🔧 Repairs & Servicing' },
  { value: 'trade-in', label: '🔄 Trade-In / Sell Your Device' },
  { value: 'business', label: '💼 Business & Bulk Orders' },
  { value: 'order', label: '📦 Order & Delivery' },
  { value: 'warranty', label: '🛡️ Warranty & Returns' },
  { value: 'other', label: 'Other' },
];

const contactCards = [
  {
    icon: FaEnvelope,
    label: 'Email Us',
    value: 'support@fixtoday.co.uk',
    href: 'mailto:support@fixtoday.co.uk',
    desc: 'We reply within 24 hours',
  },
  {
    icon: FaPhoneAlt,
    label: 'Call Us',
    value: '+44 (0) 123 456 7890',
    href: 'tel:+441234567890',
    desc: 'Mon–Sat, 9am–6pm',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Visit Us',
    value: 'Birtley, County Durham',
    href: 'https://maps.google.com/?q=Birtley,County+Durham',
    desc: 'In-store repairs & collection',
  },
];

const quickHelp = [
  { icon: FaTruck, label: 'Delivery Info', href: '/delivery' },
  { icon: FaShieldAlt, label: 'Warranty', href: '/warranty' },
  { icon: FaTools, label: 'Repairs', href: '/repairs/laptop' },
  { icon: FaGraduationCap, label: 'Student Deals', href: '/student-deals' },
  { icon: FaBriefcase, label: 'For Business', href: '/business/laptops' },
  { icon: FaQuestionCircle, label: 'FAQs', href: '/faqs' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a topic';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 6000);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* ─── Hero ─────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <nav className="flex items-center space-x-2 text-xs text-blue-100 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <FaChevronRight className="text-[8px]" />
              <span className="text-white font-medium">Contact Us</span>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm">
                <FaHeadset className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Get in Touch
                </h1>
                <p className="text-sm text-blue-100 mt-1">
                  Questions about a laptop, repair or student deal? We're here to help.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Contact Cards ────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contactCards.map((card, i) => (
              <motion.a
                key={card.label}
                href={card.href}
                target={card.label === 'Visit Us' ? '_blank' : undefined}
                rel={card.label === 'Visit Us' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    <card.icon className="text-white text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {card.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">
                      {card.value}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{card.desc}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* ─── Form + Sidebar ───────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                    <FaCommentAlt className="text-blue-600 text-[10px]" />
                    <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                      Send a Message
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Tell us how we can help
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill in the form below and our team will get back to you within 24 hours.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <FaCheckCircle className="text-3xl text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        Thanks for reaching out. We've received your message and will
                        reply within 24 hours during business days.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all"
                      >
                        <span>Send Another Message</span>
                        <FaArrowRight className="text-xs" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      noValidate
                    >
                      {/* Name + Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                          >
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="John Smith"
                              className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all ${
                                errors.name
                                  ? 'border-rose-300 focus:border-rose-400'
                                  : 'border-gray-200 focus:border-blue-400'
                              }`}
                            />
                          </div>
                          {errors.name && (
                            <p className="mt-1 text-[10px] text-rose-500 flex items-center space-x-1">
                              <FaExclamationTriangle className="text-[8px]" />
                              <span>{errors.name}</span>
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                          >
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="john@example.com"
                              className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all ${
                                errors.email
                                  ? 'border-rose-300 focus:border-rose-400'
                                  : 'border-gray-200 focus:border-blue-400'
                              }`}
                            />
                          </div>
                          {errors.email && (
                            <p className="mt-1 text-[10px] text-rose-500 flex items-center space-x-1">
                              <FaExclamationTriangle className="text-[8px]" />
                              <span>{errors.email}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Phone + Subject row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Phone (optional) */}
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                          >
                            Phone{' '}
                            <span className="text-gray-400 font-normal normal-case">
                              (optional)
                            </span>
                          </label>
                          <div className="relative">
                            <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+44 7700 900000"
                              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        {/* Subject */}
                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                          >
                            Topic <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none z-10" />
                            <select
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer ${
                                errors.subject
                                  ? 'border-rose-300 focus:border-rose-400'
                                  : 'border-gray-200 focus:border-blue-400'
                              } ${!formData.subject ? 'text-gray-400' : 'text-gray-800'}`}
                            >
                              {subjectOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs rotate-90 pointer-events-none" />
                          </div>
                          {errors.subject && (
                            <p className="mt-1 text-[10px] text-rose-500 flex items-center space-x-1">
                              <FaExclamationTriangle className="text-[8px]" />
                              <span>{errors.subject}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                        >
                          Your Message <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <FaCommentAlt className="absolute left-3 top-3.5 text-gray-400 text-xs" />
                          <textarea
                            id="message"
                            name="message"
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us about your enquiry — include your order number if relevant..."
                            maxLength={1000}
                            className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none ${
                              errors.message
                                ? 'border-rose-300 focus:border-rose-400'
                                : 'border-gray-200 focus:border-blue-400'
                            }`}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          {errors.message ? (
                            <p className="text-[10px] text-rose-500 flex items-center space-x-1">
                              <FaExclamationTriangle className="text-[8px]" />
                              <span>{errors.message}</span>
                            </p>
                          ) : (
                            <span className="text-[10px] text-gray-400">
                              We'll never share your details.
                            </span>
                          )}
                          <span
                            className={`text-[10px] ${
                              formData.message.length > 900
                                ? 'text-amber-500 font-medium'
                                : 'text-gray-400'
                            }`}
                          >
                            {formData.message.length}/1000
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 flex items-center space-x-1.5">
                          <FaShieldAlt className="text-emerald-500" />
                          <span>Your information is safe and encrypted.</span>
                        </p>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-md ${
                            isSubmitting
                              ? 'bg-blue-400 text-white cursor-wait'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="text-sm" />
                              <span>Send Message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Opening Hours */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaClock className="text-blue-600 text-sm" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Opening Hours
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {[
                    { day: 'Monday – Friday', hours: '9:00am – 6:00pm' },
                    { day: 'Saturday', hours: '10:00am – 5:00pm' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map((row) => (
                    <li
                      key={row.day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{row.day}</span>
                      <span
                        className={`font-semibold ${
                          row.hours === 'Closed'
                            ? 'text-rose-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {row.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Help */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FaQuestionCircle className="text-indigo-600 text-sm" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Quick Help
                  </h3>
                </div>
                <ul className="space-y-2">
                  {quickHelp.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <item.icon className="text-xs text-gray-400 group-hover:text-blue-600 transition-colors" />
                          <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium transition-colors">
                            {item.label}
                          </span>
                        </div>
                        <FaChevronRight className="text-[8px] text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Student CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FaGraduationCap className="text-2xl" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Student Discount
                  </h3>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                  Show your student ID and unlock exclusive prices on laptops, phones,
                  tablets, accessories and repairs.
                </p>
                <Link
                  href="/student-deals"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-blue-700 text-xs font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  <span>Get Student Discount</span>
                  <FaChevronRight className="text-[10px]" />
                </Link>
              </div>

              {/* Business CTA */}
              <div className="bg-gray-900 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FaBriefcase className="text-xl" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    For Business
                  </h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Bulk orders, IT services and business trade-in for Dell, HP and Lenovo
                  laptops.
                </p>
                <Link
                  href="/business/laptops"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-blue-300 hover:text-white transition-colors"
                >
                  <span>Explore Business Solutions</span>
                  <FaChevronRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}