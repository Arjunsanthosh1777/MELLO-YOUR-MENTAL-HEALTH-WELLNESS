import React from 'react';
import {
  AlertTriangle,
  Phone,
  HeartHandshake,
  Users,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

interface EmergencyPageProps {
  onBack?: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        )}

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-white">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <AlertTriangle size={34} />
            </div>

            <h1 className="text-3xl font-bold">
              You're Not Alone
            </h1>

            <p className="mt-2 text-red-50">
              Mello noticed that you may be going through a very difficult
              moment right now.
            </p>
          </div>

          {/* Content */}
          <div className="p-8">

            <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 shrink-0 text-red-500" />

                <div>
                  <h2 className="font-bold text-gray-900">
                    Your safety comes first
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    If you feel that you might hurt yourself or are in
                    immediate danger, please move to a safe place and stay
                    with someone you trust.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="space-y-4">

              {/* 112 */}
              <a
                href="tel:112"
                className="flex items-center justify-between rounded-2xl bg-red-600 p-5 text-white transition hover:bg-red-700"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-white/20 p-3">
                    <Phone size={24} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Call Emergency Services
                    </p>
                    <p className="text-sm text-red-100">
                      Immediate emergency assistance
                    </p>
                  </div>
                </div>

                <span className="text-xl font-bold">
                  112
                </span>
              </a>

              {/* Tele MANAS */}
              <a
                href="tel:14416"
                className="flex items-center justify-between rounded-2xl border border-purple-200 bg-purple-50 p-5 transition hover:bg-purple-100"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                    <HeartHandshake size={24} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">
                      Talk to a Mental Health Professional
                    </p>

                    <p className="text-sm text-gray-600">
                      Tele-MANAS • 24×7 support
                    </p>
                  </div>
                </div>

                <span className="font-bold text-purple-700">
                  14416
                </span>
              </a>

              {/* Trusted person */}
              <button
                onClick={() => {
                  alert(
                    'Please reach out to a trusted friend, family member, teacher, counsellor, or another person who can stay with you.'
                  );
                }}
                className="flex w-full items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-5 text-left transition hover:bg-green-100"
              >
                <div className="rounded-xl bg-green-100 p-3 text-green-600">
                  <Users size={24} />
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    Contact Someone You Trust
                  </p>

                  <p className="text-sm text-gray-600">
                    Don't stay alone with these feelings.
                  </p>
                </div>
              </button>

            </div>

            {/* Bottom message */}
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-700">
                You don't have to handle this moment by yourself.
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Mello is here to support you, but it cannot replace
                professional emergency care.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};