// src/app/privacy-policy/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaCookieBite,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaChevronRight,
  FaCheckCircle,
  FaInfoCircle,
  FaGlobe,
  FaDatabase,
  FaShareAlt,
  FaClock,
  FaChild,
  FaBalanceScale,
  FaSyncAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const sections = [
  {
    id: 'introduction',
    icon: FaInfoCircle,
    title: '1. Introduction',
    content: [
      'Welcome to FixToday ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website fixtoday.co.uk, make a purchase, or interact with our services.',
      'Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this policy. If you do not agree with these terms, please discontinue use of our services immediately.',
    ],
  },
  {
    id: 'information-we-collect',
    icon: FaDatabase,
    title: '2. Information We Collect',
    content: [
      'We collect personal information that you voluntarily provide to us when you register on our website, place an order, subscribe to our newsletter, or contact us for support.',
      'The personal information we collect may include:',
      '• **Contact Data**: Name, email address, phone number, and billing/shipping address.',
      '• **Payment Data**: Credit card details, PayPal information, and other payment method details. All payment transactions are processed by secure third-party payment processors.',
      '• **Account Data**: Username, password, purchase history, and wishlist items.',
      '• **Technical Data**: IP address, browser type, device information, and operating system.',
      '• **Usage Data**: Information about how you use our website, products, and services.',
      '• **Marketing Data**: Your preferences for receiving marketing communications.',
    ],
  },
  {
    id: 'how-we-use',
    icon: FaUserShield,
    title: '3. How We Use Your Information',
    content: [
      'We use the information we collect for various purposes, including:',
      '• Processing and fulfilling your orders, including shipping and delivery.',
      '• Managing your account and providing customer support.',
      '• Sending you transactional emails, order confirmations, and shipping updates.',
      '• Personalizing your shopping experience and recommending products.',
      '• Improving our website, products, and services.',
      '• Sending marketing communications (with your consent).',
      '• Complying with legal obligations and preventing fraud.',
      '• Analyzing website usage to enhance user experience.',
    ],
  },
  {
    id: 'information-sharing',
    icon: FaShareAlt,
    title: '4. Information Sharing & Disclosure',
    content: [
      'We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:',
      '• **Service Providers**: With trusted third-party vendors who assist us in operating our website, processing payments, and delivering orders.',
      '• **Business Partners**: With partners who offer complementary products or services, but only with your explicit consent.',
      '• **Legal Requirements**: When required by law, subpoena, or other legal process.',
      '• **Business Transfers**: In connection with a merger, acquisition, or sale of assets.',
      '• **Protection of Rights**: To protect the rights, property, or safety of FixToday, our customers, or others.',
    ],
  },
  {
    id: 'cookies',
    icon: FaCookieBite,
    title: '5. Cookies & Tracking Technologies',
    content: [
      'We use cookies, web beacons, and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:',
      '• Remember your preferences and settings.',
      '• Keep items in your shopping cart.',
      '• Understand how you use our website.',
      '• Deliver personalized advertisements.',
      'You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website. For more details, please review our Cookie Policy.',
    ],
  },
  {
    id: 'data-security',
    icon: FaLock,
    title: '6. Data Security',
    content: [
      'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      'These measures include:',
      '• 256-bit SSL encryption for all data transmissions.',
      '• Secure servers and firewalls.',
      '• Regular security audits and vulnerability assessments.',
      '• Restricted access to personal information on a need-to-know basis.',
      '• Employee training on data protection and privacy.',
      'While we strive to protect your personal information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.',
    ],
  },
  {
    id: 'your-rights',
    icon: FaBalanceScale,
    title: '7. Your Privacy Rights',
    content: [
      'Depending on your location, you may have the following rights regarding your personal information:',
      '• **Right to Access**: Request a copy of the personal information we hold about you.',
      '• **Right to Rectification**: Request correction of inaccurate or incomplete information.',
      '• **Right to Erasure**: Request deletion of your personal information.',
      '• **Right to Restrict Processing**: Request restriction of how we use your information.',
      '• **Right to Data Portability**: Request transfer of your data to another organization.',
      '• **Right to Object**: Object to our processing of your personal information.',
      '• **Right to Withdraw Consent**: Withdraw consent for marketing communications at any time.',
      'To exercise any of these rights, please contact us at support@fixtoday.co.uk.',
    ],
  },
  {
    id: 'childrens-privacy',
    icon: FaChild,
    title: '8. Children\'s Privacy',
    content: [
      'Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.',
    ],
  },
  {
    id: 'international-transfers',
    icon: FaGlobe,
    title: '9. International Data Transfers',
    content: [
      'Your information may be transferred to, stored, and processed in countries outside of your country of residence. These countries may have data protection laws that are different from your country.',
      'When we transfer your information internationally, we take appropriate safeguards to ensure your data receives an adequate level of protection, including the use of standard contractual clauses approved by relevant authorities.',
    ],
  },
  {
    id: 'changes',
    icon: FaSyncAlt,
    title: '10. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by:',
      '• Posting the updated policy on this page.',
      '• Updating the "Last Updated" date at the top of this page.',
      '• Sending you an email notification (for significant changes).',
      'We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.',
    ],
  },
  {
    id: 'contact',
    icon: FaEnvelope,
    title: '11. Contact Us',
    content: [
      'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:',
    ],
    isContact: true,
  },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 15, 2025';

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-blue-100 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <FaChevronRight className="text-[8px]" />
              <span className="text-white font-medium">Privacy Policy</span>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm">
                <FaShieldAlt className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Privacy Policy
                </h1>
                <p className="text-sm text-blue-100 mt-1">
                  Your privacy is important to us. Learn how we protect your data.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4 text-xs text-blue-100">
              <FaClock className="text-[10px]" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
                    >
                      <section.icon className="text-[10px] text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                      <span className="truncate">{section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Intro Card */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <FaInfoCircle className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      Quick Summary
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We collect only the information necessary to provide you with the best shopping experience. 
                      We never sell your data to third parties. You have full control over your personal information 
                      and can request access, correction, or deletion at any time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sections */}
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 scroll-mt-24"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                      <section.icon className="text-white text-sm" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-3 pl-1">
                    {section.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={`text-sm leading-relaxed ${
                          paragraph.startsWith('•')
                            ? 'text-gray-600 pl-4 flex items-start'
                            : 'text-gray-600'
                        }`}
                      >
                        {paragraph.startsWith('•') ? (
                          <>
                            <FaCheckCircle className="text-emerald-500 text-[10px] mt-1 mr-2 flex-shrink-0" />
                            <span
                              dangerouslySetInnerHTML={{
                                __html: paragraph
                                  .replace('• ', '')
                                  .replace(
                                    /\*\*(.*?)\*\*/g,
                                    '<strong class="text-gray-800">$1</strong>'
                                  ),
                              }}
                            />
                          </>
                        ) : (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: paragraph.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="text-gray-800">$1</strong>'
                              ),
                            }}
                          />
                        )}
                      </p>
                    ))}

                    {section.isContact && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <a
                          href="mailto:support@fixtoday.co.uk"
                          className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                        >
                          <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-blue-200">
                            <FaEnvelope className="text-blue-600 text-xs" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium">Email</p>
                            <p className="text-xs font-semibold text-gray-700">
                              support@fixtoday.co.uk
                            </p>
                          </div>
                        </a>
                        <a
                          href="tel:+441234567890"
                          className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                        >
                          <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-blue-200">
                            <FaPhoneAlt className="text-blue-600 text-xs" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium">Phone</p>
                            <p className="text-xs font-semibold text-gray-700">
                              +44 (0) 123 456 7890
                            </p>
                          </div>
                        </a>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="p-2 bg-white rounded-lg border border-gray-200">
                            <FaMapMarkerAlt className="text-blue-600 text-xs" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium">Address</p>
                            <p className="text-xs font-semibold text-gray-700">
                              123 Tech Street, London
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Footer Note */}
              <div className="bg-gray-100 rounded-2xl p-5 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <FaExclamationTriangle className="text-amber-500 text-sm mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This Privacy Policy is provided for informational purposes and does not constitute legal advice. 
                    For specific legal concerns, please consult with a qualified attorney. By using our services, 
                    you acknowledge that you have read and understood this policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}