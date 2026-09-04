import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Video,
  Loader2,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { INITIAL_THERAPISTS } from '../services/storageService';

const TherapistPayment: React.FC = () => {
  const { navigate, selectedTherapistId, showToast } = useApp();

  const therapist = INITIAL_THERAPISTS.find(
    (t) => t.id === selectedTherapistId
  );

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  /* =========================================================
     NO THERAPIST SELECTED
  ========================================================= */

  if (!therapist) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-red-100 shadow-mello p-8 text-center max-w-md">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <Video className="w-7 h-7 text-red-500" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900">
            Therapist not selected
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Please select a therapist before making a payment.
          </p>

          <button
            onClick={() => navigate('therapists')}
            className="mt-6 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold"
          >
            Choose Therapist
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAYMENT
  ========================================================= */

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !expiry || !cvv) {
        showToast('Please fill in all card details.');
        return;
      }
    }

    if (paymentMethod === 'upi') {
      if (!upiId) {
        showToast('Please enter your UPI ID.');
        return;
      }
    }

    setIsProcessing(true);

    // Demo payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      showToast(
        `Payment successful! Your session with ${therapist.name} is confirmed.`
      );
    }, 1800);
  };

  /* =========================================================
     START VIDEO CALL
  ========================================================= */

  const startVideoCall = () => {
    navigate('therapist-video-call', {
      therapistId: therapist.id,
    });
  };

  /* =========================================================
     PAYMENT SUCCESS SCREEN
  ========================================================= */

  if (paymentSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-mello overflow-hidden">

          <div className="bg-gradient-to-br from-emerald-50 via-white to-purple-50 p-8 sm:p-12 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-11 h-11 text-emerald-600" />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
              Payment Successful 🎉
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Your therapy session has been confirmed.
            </p>

          </div>

          <div className="p-6 sm:p-8">

            {/* THERAPIST */}
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">

              <img
                src={therapist.avatar}
                alt={therapist.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              />

              <div>
                <h3 className="font-extrabold text-slate-900">
                  {therapist.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {therapist.title}
                </p>

                <p className="text-xs text-emerald-600 font-bold mt-1">
                  ✓ Session confirmed
                </p>
              </div>

            </div>

            {/* PAYMENT DETAILS */}
            <div className="grid grid-cols-2 gap-3 mt-5">

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">
                  Session
                </p>

                <p className="text-sm font-bold text-slate-800 mt-1">
                  Video Consultation
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">
                  Amount Paid
                </p>

                <p className="text-sm font-bold text-slate-800 mt-1">
                  {therapist.pricePerSession}
                </p>
              </div>

            </div>

            {/* START VIDEO */}
            <button
              onClick={startVideoCall}
              className="w-full mt-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Video className="w-5 h-5" />
              Start Video Session
            </button>

            {/* BACK */}
            <button
              onClick={() => navigate('therapists')}
              className="w-full mt-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm"
            >
              Back to Therapists
            </button>

          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAYMENT PAGE
  ========================================================= */

  return (
    <div className="max-w-5xl mx-auto py-4 pb-12">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate('therapists')}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Therapists
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* =====================================================
            BOOKING SUMMARY
        ===================================================== */}

        <div className="lg:col-span-2">

          <div className="bg-white rounded-3xl border border-purple-100 shadow-mello p-6">

            <p className="text-xs font-extrabold uppercase tracking-wider text-purple-600">
              Booking Summary
            </p>

            <div className="flex items-center gap-4 mt-5">

              <img
                src={therapist.avatar}
                alt={therapist.name}
                className="w-20 h-20 rounded-2xl object-cover border border-purple-100 shadow-sm"
              />

              <div>

                <h2 className="text-lg font-extrabold text-slate-900">
                  {therapist.name}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {therapist.title}
                </p>

                {therapist.verified && (
                  <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Therapist
                  </div>
                )}

              </div>

            </div>

            <div className="border-t border-slate-100 mt-6 pt-5 space-y-4">

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Session
                </span>

                <span className="font-bold text-slate-800">
                  Video
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Duration
                </span>

                <span className="font-bold text-slate-800">
                  50 minutes
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Therapist
                </span>

                <span className="font-bold text-slate-800">
                  {therapist.name}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">

                <span className="font-extrabold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-extrabold text-purple-600">
                  {therapist.pricePerSession}
                </span>

              </div>

            </div>

            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">

              <div className="flex gap-2">

                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />

                <div>
                  <p className="text-xs font-extrabold text-emerald-800">
                    Secure Payment
                  </p>

                  <p className="text-[10px] text-emerald-700 mt-1 leading-relaxed">
                    Your payment information is protected and encrypted.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            PAYMENT FORM
        ===================================================== */}

        <div className="lg:col-span-3">

          <div className="bg-white rounded-3xl border border-purple-100 shadow-mello p-6 sm:p-8">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Secure Payment
                </h1>

                <p className="text-xs text-slate-500 mt-1">
                  Complete payment to confirm your therapy session.
                </p>
              </div>

            </div>

            {/* PAYMENT METHODS */}
            <div className="grid grid-cols-2 gap-3 mt-7">

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 bg-white hover:border-purple-200'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto text-purple-600" />

                <p className="text-xs font-bold mt-2">
                  Card
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 bg-white hover:border-purple-200'
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto text-purple-600" />

                <p className="text-xs font-bold mt-2">
                  UPI
                </p>
              </button>

            </div>

            {/* CARD FORM */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mt-7">

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Name on Card
                  </label>

                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Enter cardholder name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Card Number
                  </label>

                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Expiry
                    </label>

                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      CVV
                    </label>

                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* UPI FORM */}
            {paymentMethod === 'upi' && (
              <div className="mt-7">

                <label className="block text-xs font-bold text-slate-700 mb-2">
                  UPI ID
                </label>

                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                />

                <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs text-slate-500">
                  Enter your UPI ID to continue with the payment.
                </div>

              </div>
            )}

            {/* PAY BUTTON */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay {therapist.pricePerSession}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure & encrypted checkout
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TherapistPayment;