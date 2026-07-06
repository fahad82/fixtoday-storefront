// app/checkout/page.tsx - COMPLETE FIXED VERSION
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { 
  FaArrowLeft, 
  FaPaypal, 
  FaApplePay,
  FaGooglePay,
  FaTruck,
  FaUndo,
  FaLock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaFlag,
  FaCheckCircle,
  FaClock,
  FaInfoCircle,
  FaExclamationTriangle,
  FaMapMarkedAlt,
  FaShippingFast,
  FaSpinner
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';

interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  postcode: string;
  country: string;
  saveInfo: boolean;
}

interface DeliveryOption {
  id: string;
  name: string;
  duration: string;
  price: number;
  estimated: string;
  description: string;
  cutOffTime?: string;
  processingTime?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    saveInfo: false,
  });
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const subtotal = getCartTotal();
  
  const deliveryOptions: DeliveryOption[] = [
    { 
      id: 'express', 
      name: 'Express Delivery', 
      duration: '1-2 Days', 
      price: 6.99, 
      estimated: 'Arrives in 1-2 working days',
      description: 'Fastest delivery option. Order before 2:00 PM for next-day dispatch.',
      cutOffTime: '2:00 PM',
      processingTime: 'Same day processing (Mon-Fri)'
    },
    { 
      id: 'standard', 
      name: 'Standard Delivery', 
      duration: '2-5 Days', 
      price: 3.99, 
      estimated: 'Arrives in 2-5 working days',
      description: 'Reliable standard delivery service.',
      processingTime: '1-2 business days processing'
    },
    { 
      id: 'free', 
      name: 'Free Delivery', 
      duration: '3-6 Days', 
      price: 0, 
      estimated: 'Arrives in 3-6 working days',
      description: 'Free delivery on orders over £50.',
      processingTime: '2-3 business days processing'
    },
  ];

  const selectedDeliveryOption = deliveryOptions.find(opt => opt.id === selectedDelivery);
  const shipping = (subtotal >= 50 && selectedDelivery === 'standard') ? 0 : 
                   selectedDeliveryOption?.price || 0;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit / Debit Card', icon: (
      <div className="flex items-center gap-1">
        <SiVisa className="w-6 h-6 text-[#1434CB]" />
        <SiMastercard className="w-6 h-6 text-[#EB001B]" />
        <SiAmericanexpress className="w-6 h-6 text-[#006FCF]" />
      </div>
    ) },
    { id: 'paypal', name: 'PayPal', icon: <FaPaypal className="w-6 h-6 text-[#003087]" /> },
    { id: 'apple', name: 'Apple Pay', icon: <FaApplePay className="w-6 h-6 text-[#333333]" /> },
    { id: 'google', name: 'Google Pay', icon: <FaGooglePay className="w-6 h-6 text-[#5F6368]" /> },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setOrderError(null);

    try {
      // Prepare order data
      const orderData = {
        firstName: billingDetails.firstName,
        lastName: billingDetails.lastName,
        email: billingDetails.email,
        phone: billingDetails.phone,
        address: billingDetails.address,
        apartment: billingDetails.apartment,
        city: billingDetails.city,
        postcode: billingDetails.postcode,
        country: billingDetails.country,
        deliveryMethod: selectedDelivery,
        deliveryPrice: shipping,
        deliveryEstimated: selectedDeliveryOption?.estimated || '',
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentMethod: selectedPayment,
        notes: '',
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId || null,
          name: item.name,
          sku: item.sku || '',
          variantName: item.variantName || '',
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.originalPrice || null,
          total: item.price * item.quantity,
          image: item.image || null
        }))
      };

      // Use the full URL to the backend API - NO AUTHENTICATION REQUIRED
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // ✅ No Authorization header - allows guest checkout
        },
        body: JSON.stringify(orderData)
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || 'Failed to place order');
        } catch {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();

      if (result.success) {
        // Clear cart and redirect to success page
        clearCart();
        window.location.href = `/order-success?order=${result.order.order_number}`;
      } else {
        throw new Error(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setOrderError(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            <FaArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Full Width Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link href="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition w-fit font-medium">
              <FaArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-500 text-sm mt-1">Complete your order securely</p>
            </div>
            <div className="hidden sm:block w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Billing Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Progress Steps */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                  {[
                    { number: 1, label: 'Information' },
                    { number: 2, label: 'Delivery' },
                    { number: 3, label: 'Payment' }
                  ].map((stepItem, index) => (
                    <div key={stepItem.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all ${
                          step >= stepItem.number 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {step > stepItem.number ? <FaCheckCircle className="w-5 h-5" /> : stepItem.number}
                        </div>
                        <span className="text-xs font-medium text-gray-600 mt-1 hidden sm:block">{stepItem.label}</span>
                      </div>
                      {index < 2 && (
                        <div className={`flex-1 h-0.5 mx-4 transition-all ${
                          step > stepItem.number ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Billing Information */}
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Billing Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={billingDetails.firstName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={billingDetails.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={billingDetails.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={billingDetails.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                          placeholder="+44 123 456 7890"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={billingDetails.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                        placeholder="123 Main Street"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apartment, Suite, etc. <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={billingDetails.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="city"
                          required
                          value={billingDetails.city}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                          placeholder="London"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        required
                        value={billingDetails.postcode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                        placeholder="E1 6AN"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaFlag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                          name="country"
                          required
                          value={billingDetails.country}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 appearance-none cursor-pointer"
                        >
                          <option>United Kingdom</option>
                          <option>England</option>
                          <option>Scotland</option>
                          <option>Wales</option>
                          <option>Northern Ireland</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={billingDetails.saveInfo}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Save this information for next time</span>
                    </label>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      Continue to Delivery →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Options */}
              {step === 2 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Options</h2>
                  
                  {/* Delivery Info Banner */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <FaShippingFast className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Delivery Information</p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                          <li>• Orders are processed Monday–Friday</li>
                          <li>• Orders placed after 2:00 PM processed next working day</li>
                          <li>• Free UK delivery on orders over £50</li>
                          <li>• Track your parcel with our courier service</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {deliveryOptions.map((option) => {
                      const isFree = option.id === 'free';
                      const isEligibleForFree = subtotal >= 50 && option.id === 'standard';
                      const displayPrice = isEligibleForFree ? 0 : option.price;
                      const showFreeBadge = isEligibleForFree || isFree;
                      
                      return (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedDelivery === option.id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                          } ${isEligibleForFree && option.id === 'standard' ? 'border-green-300 bg-green-50' : ''}`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <input
                              type="radio"
                              name="delivery"
                              value={option.id}
                              checked={selectedDelivery === option.id}
                              onChange={(e) => setSelectedDelivery(e.target.value)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <FaTruck className={`w-5 h-5 ${selectedDelivery === option.id ? 'text-blue-600' : 'text-gray-500'}`} />
                                <span className={`font-semibold ${selectedDelivery === option.id ? 'text-gray-900' : 'text-gray-800'}`}>
                                  {option.name}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 font-medium rounded-full">
                                  {option.duration}
                                </span>
                                {showFreeBadge && (
                                  <span className="text-xs px-2 py-0.5 bg-green-500 text-white font-medium rounded-full animate-pulse">
                                    FREE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{option.description}</p>
                              {option.cutOffTime && (
                                <p className="text-xs text-gray-400 mt-1">
                                  <span className="font-medium">Cut-off:</span> {option.cutOffTime}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {displayPrice === 0 ? (
                                <span className="text-green-600 font-bold text-base">FREE</span>
                              ) : (
                                <span className="font-bold text-gray-900 text-base">£{formatPrice(displayPrice)}</span>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Delivery Locations */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                      <FaMapMarkedAlt className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Delivery Locations</p>
                        <p className="text-xs text-gray-600 mt-1">We deliver throughout:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200">England</span>
                          <span className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200">Scotland</span>
                          <span className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200">Wales</span>
                          <span className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200">Northern Ireland</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          <FaExclamationTriangle className="inline w-3 h-3 mr-1 text-amber-500" />
                          Highlands, Islands, Isle of Man, and Channel Islands may require extra delivery time or charges.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Processing Info */}
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-3">
                      <FaClock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Order Processing</p>
                        <ul className="text-xs text-amber-700 mt-1 space-y-1">
                          <li>• Orders processed Monday–Friday</li>
                          <li>• Orders after 2:00 PM processed next working day</li>
                          <li>• Weekend/Bank holiday orders processed next working day</li>
                          <li>• You'll receive confirmation via email/WhatsApp once dispatched</li>
                          <li>• Tracking information provided for all eligible deliveries</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className={`font-semibold ${selectedPayment === method.id ? 'text-gray-900' : 'text-gray-700'}`}>
                            {method.name}
                          </span>
                        </div>
                        {method.icon}
                      </label>
                    ))}
                  </div>

                  {selectedPayment === 'card' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900 placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Error */}
                  {orderError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{orderError}</p>
                    </div>
                  )}

                  {/* Delivery Disclaimer */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                      <FaInfoCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-700">Delivery Disclaimer</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Delivery times are estimates and may be affected by weather, courier delays, 
                          or peak periods such as Christmas and Black Friday. We are not responsible for 
                          delays caused by the courier once the parcel has been dispatched.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <FaSpinner className="w-5 h-5 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        `Place Order - £${formatPrice(total)}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaTruck className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl">📱</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      {item.variantName && (
                        <p className="text-xs text-gray-500 mb-2">{item.variantName}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-bold text-blue-600 text-base">
                          £{formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">£{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? 'FREE' : `£${formatPrice(shipping)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (VAT 20%)</span>
                  <span className="font-semibold text-gray-900">£{formatPrice(tax)}</span>
                </div>
                
                {shipping > 0 && subtotal < 50 && (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-amber-800">
                      Add £{(50 - subtotal).toFixed(2)} more to get FREE delivery!
                    </p>
                  </div>
                )}
                
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    £{formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Delivery Info Cards */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm p-3 bg-green-50 rounded-xl">
                  <FaTruck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Free Delivery Available</p>
                    <p className="text-xs text-green-600">On orders over £50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-purple-50 rounded-xl">
                  <FaUndo className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-purple-800">Easy Returns</p>
                    <p className="text-xs text-purple-600">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-blue-50 rounded-xl">
                  <FaLock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-800">Secure Checkout</p>
                    <p className="text-xs text-blue-600">SSL encrypted payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}