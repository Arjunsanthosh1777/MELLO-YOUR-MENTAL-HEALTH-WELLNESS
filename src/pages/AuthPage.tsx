import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MelloAvatar } from '../components/common/MelloAvatar';
import { firebaseService } from '../services/firebaseService';

export const AuthPage: React.FC = () => {
  const { navigate, updateUser, showToast } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [privacyAgreed, setPrivacyAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isSignUp) {
      if (!ageConfirmed || !privacyAgreed) {
        showToast('Please confirm age and privacy terms.', 'info');
        return;
      }
      updateUser({ name: name || 'Friend', email, ageConfirmed, privacyAgreed, onboardingCompleted: false });
      showToast('Account created! Welcome to Mello.', 'success');
      navigate('onboarding');
    } else {
      updateUser({ email, onboardingCompleted: true });
      showToast('Welcome back to Mello!', 'success');
      navigate('home');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const user = await firebaseService.signInWithGoogle();
      updateUser({ 
        id: user.uid,
        name: user.displayName || 'Friend', 
        email: user.email || 'user@mello.app', 
        onboardingCompleted: true 
      });
      showToast('Signed in with Google! 🎉', 'success');
      navigate('home');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        showToast('Sign-in cancelled.', 'info');
      } else if (error.code === 'auth/unauthorized-domain') {
        showToast('Domain not authorized. Check Firebase console settings.', 'xp');
      } else {
        showToast(`Sign-in failed: ${error.message}`, 'xp');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto my-auto bg-white rounded-3xl shadow-mello-lg border border-purple-100 p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="text-center space-y-2">
          <MelloAvatar size="md" className="mx-auto" />
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            {isSignUp ? 'Create your Mello Space 🌱' : 'Welcome back to Mello 👋'}
          </h2>
          <p className="text-xs text-slate-500">
            {isSignUp ? 'A safe, gentle daily companion for your mind' : 'Continue your daily mental wellness journey'}
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          type="button"
          className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 disabled:bg-slate-100 disabled:opacity-50 border border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3 text-sm shadow-sm transition-colors"
        >
          {isGoogleLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="flex items-center space-x-3 text-slate-400 text-xs my-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span>or email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Your Preferred Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-2 pt-1 text-xs text-slate-600">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-400"
                />
                <span>I confirm I am 13 years or older</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-400"
                />
                <span>I accept Mello's Privacy Agreement & Terms</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello transition-all text-sm mt-2"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Login / Signup */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)} className="text-purple-600 font-bold hover:underline">
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsSignUp(true)} className="text-purple-600 font-bold hover:underline">
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Privacy Callout */}
        <div className="p-3 bg-purple-50 rounded-2xl flex items-center space-x-2 text-[11px] text-purple-900 border border-purple-100">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
          <span>"Your conversations are private and you control your data."</span>
        </div>
      </div>
    </div>
  );
};
