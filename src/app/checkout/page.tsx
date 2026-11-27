// app/checkout/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
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
  FaShieldAlt,
  FaWallet
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';
import toast from 'react-hot-toast';
import { DELIVERY_OPTIONS, DeliveryMethod, deliveryPrice, includedVat, orderErrorMessage, orderService } from '@/services/orderService';

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


export default function CheckoutPage() {
  const { cartItems, getTotalPrice, isReady } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
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
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod>('standard');

  const subtotal = getTotalPrice();
  
  const deliveryOptions = DELIVERY_OPTIONS;
  // Prices include VAT. The server works out the final amount; this is the same sum.
  const shipping = deliveryPrice(selectedDelivery, subtotal);
  const total = subtotal + shipping;
  const tax = includedVat(total);

  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      const { firstName, lastName, email, phone, address, city, postcode, country } = billingDetails;
      if (!firstName || !lastName || !email || !phone || !address || !city || !postcode || !country) {
        toast.error('Please fill in all required fields');
        return false;
      }
      if (!email.includes('@') || !email.includes('.')) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = (nextStep: number) => {
    if (validateStep(step)) {
      setStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    setIsProcessing(true);
    try {
      const { url } = await orderService.startStripeCheckout({
        firstName: billingDetails.firstName.trim(),
        lastName: billingDetails.lastName.trim(),
        email: billingDetails.email.trim(),
        phone: billingDetails.phone.trim(),
        address: billingDetails.address.trim(),
        ...(billingDetails.apartment.trim() && { apartment: billingDetails.apartment.trim() }),
        city: billingDetails.city.trim(),
        postcode: billingDetails.postcode.trim(),
        country: billingDetails.country,
        deliveryMethod: selectedDelivery,
        items: cartItems.map((item) => ({
          productId: item.id,
          ...(item.variantId && { variantId: item.variantId }),
          quantity: item.quantity,
        })),
      });
      // The basket is emptied on the confirmation page, once payment is confirmed.
      window.location.assign(url);
    } catch (error) {
      toast.error(orderErrorMessage(error), { duration: 6000 });
      setIsProcessing(false);
    }
  };

  // Coming back from Stripe without paying: the basket is still here.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('cancelled') === '1') {
      toast('Payment cancelled. Your basket is saved, so you can try again.', { icon: 'ℹ️', duration: 6000 });
      window.history.replaceState(null, '', '/checkout');
    }
  }, []);

  if (!isReady) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" aria-busy="true" />;
  }

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition w-fit font-medium">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Australia</option>
                          <option>Germany</option>
                          <option>France</option>
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
                      onClick={() => handleNextStep(2)}
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
                  
                  <div className="space-y-4">
                    {deliveryOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedDelivery === option.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <input
                            type="radio"
                            name="delivery"
                            value={option.id}
                            checked={selectedDelivery === option.id}
                            onChange={(e) => setSelectedDelivery(e.target.value as DeliveryMethod)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FaTruck className={`w-5 h-5 ${selectedDelivery === option.id ? 'text-blue-600' : 'text-gray-500'}`} />
                              <span className={`font-semibold ${selectedDelivery === option.id ? 'text-gray-900' : 'text-gray-800'}`}>
                                {option.name}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 font-medium rounded-full">{option.duration}</span>
                            </div>
                            <p className="text-xs text-gray-500">{option.estimated}</p>
                          </div>
                          <div className="text-right">
                            {option.price === 0 ? (
                              <span className="text-green-600 font-bold text-base">FREE</span>
                            ) : (
                              <span className="font-bold text-gray-900 text-base">£{formatPrice(option.price)}</span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-3">
                      <FaClock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Estimated Delivery Date</p>
                        <p className="text-sm text-amber-700 mt-1">
                          {deliveryOptions.find((o) => o.id === selectedDelivery)?.estimated}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">Standard delivery is free on orders over £50</p>
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
                      onClick={() => handleNextStep(3)}
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
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>

                  <div className="p-5 border-2 border-blue-500 bg-blue-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FaLock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Pay securely with Stripe</p>
                        <p className="text-sm text-gray-600 mt-1">
                          You will go to Stripe&apos;s secure payment page to pay by card, Apple Pay, Google Pay, PayPal or Klarna.
                          Your card details are never shared with us.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-4" aria-label="Accepted payment methods">
                      <SiVisa className="w-8 h-8 text-[#1434CB]" title="Visa" />
                      <SiMastercard className="w-8 h-8 text-[#EB001B]" title="Mastercard" />
                      <SiAmericanexpress className="w-7 h-7 text-[#006FCF]" title="American Express" />
                      <FaApplePay className="w-9 h-9 text-gray-900" title="Apple Pay" />
                      <FaGooglePay className="w-9 h-9 text-gray-700" title="Google Pay" />
                      <FaPaypal className="w-6 h-6 text-[#003087]" title="PayPal" />
                      <span className="px-2 py-0.5 rounded-md bg-[#FFA8CD] text-black text-xs font-bold">Klarna</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-gray-200 p-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">Delivering to</p>
                    <p>{billingDetails.firstName} {billingDetails.lastName}</p>
                    <p>{billingDetails.address}{billingDetails.apartment ? `, ${billingDetails.apartment}` : ''}</p>
                    <p>{billingDetails.city} {billingDetails.postcode.toUpperCase()}</p>
                    <p className="mt-1 text-gray-500">{deliveryOptions.find((o) => o.id === selectedDelivery)?.name}</p>
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
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Opening secure payment...
                        </div>
                      ) : (
                        `Pay £${formatPrice(total)}`
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <FaLock className="w-3 h-3" />
                    <span>Secure checkout. Your information is protected.</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaWallet className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2 scrollbar-thin">
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
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <p className="text-xs text-gray-500 mb-2">
                          {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <span key={key} className="mr-2">{key}: {value}</span>
                          ))}
                        </p>
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
                  <span className="text-gray-600">Includes VAT (20%)</span>
                  <span className="font-semibold text-gray-900">£{formatPrice(tax)}</span>
                </div>
                
                {selectedDelivery === 'standard' && shipping > 0 && subtotal < 50 && (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-amber-800">
                      Add £{(50 - subtotal).toFixed(2)} more to get FREE delivery!
                    </p>
                    <div className="w-full h-1.5 bg-amber-200 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                      />
                    </div>
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
                  <FaShieldAlt className="w-5 h-5 text-blue-600" />
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