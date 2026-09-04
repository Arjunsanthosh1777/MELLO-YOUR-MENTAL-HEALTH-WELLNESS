import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  CameraOff,
  CheckCircle2,
  Clock3,
  Lock,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneOff,
  ScreenShare,
  ShieldCheck,
  Sparkles,
  UserRound,
  Volume2,
  VolumeX,
  X,
  MessageCircle,
  BriefcaseBusiness,
  Star,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { INITIAL_THERAPISTS } from '../services/storageService';

const TherapistVideoCall: React.FC = () => {
  const { navigate, selectedTherapistId } = useApp();

  /* =====================================================
     SELECTED THERAPIST
  ===================================================== */

  const therapist = INITIAL_THERAPISTS.find(
    (t) => t.id === selectedTherapistId
  );

  /* =====================================================
     VIDEO / AUDIO
  ===================================================== */

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  const [seconds, setSeconds] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const [showTip, setShowTip] = useState(true);

  /* =====================================================
     THERAPIST DATA
     Uses your existing therapist object.
     Fallbacks prevent errors if some fields don't exist.
  ===================================================== */

  const therapistData = therapist as any;

  const therapistName =
    therapistData?.name || 'Your Therapist';

  const therapistTitle =
    therapistData?.title ||
    therapistData?.specialization ||
    therapistData?.role ||
    'Licensed Mental Health Professional';

  const therapistImage =
    therapistData?.image ||
    therapistData?.avatar ||
    therapistData?.photo ||
    therapistData?.profileImage ||
    therapistData?.imageUrl ||
    '';

  const therapistRating =
    therapistData?.rating ||
    therapistData?.ratings ||
    4.9;

  const therapistReviews =
    therapistData?.reviews ||
    therapistData?.reviewCount ||
    128;

  const therapistExperience =
    therapistData?.experience ||
    therapistData?.yearsExperience ||
    '8+ years';

  const therapistSpecializations =
    therapistData?.specializations ||
    therapistData?.specialties ||
    therapistData?.areas ||
    [];

  /* =====================================================
     CAMERA + MICROPHONE
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          setCameraError(true);
          return;
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        /*
         * Start with camera disabled visually.
         * Audio remains available.
         */
        stream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(
          'Camera/microphone permission error:',
          error
        );

        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      mounted = false;

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  /* =====================================================
     SESSION TIMER
  ===================================================== */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  };

  /* =====================================================
     MICROPHONE
  ===================================================== */

  const toggleMic = () => {
    const stream = streamRef.current;

    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !micOn;
      });
    }

    setMicOn((prev) => !prev);
  };

  /* =====================================================
     CAMERA
  ===================================================== */

  const toggleCamera = () => {
    const stream = streamRef.current;

    if (!stream) {
      setCameraError(true);
      return;
    }

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !cameraOn;
    });

    setCameraOn((prev) => !prev);
  };

  /* =====================================================
     END CALL
  ===================================================== */

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    navigate('therapists');
  };

  /* =====================================================
     NO THERAPIST SELECTED
  ===================================================== */

  if (!therapist) {
    return (
      <div className="min-h-[calc(100vh-40px)] bg-[#070d1d] rounded-3xl flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
            <UserRound className="w-8 h-8 text-purple-300" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            Therapist not selected
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Please select a therapist before starting a video
            session.
          </p>

          <button
            onClick={() => navigate('therapists')}
            className="mt-6 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
          >
            Choose Therapist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-40px)] bg-[#070d1d] text-white rounded-3xl overflow-hidden relative">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-40 bottom-0 w-[550px] h-[550px] rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute right-0 top-20 w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="relative z-30 h-20 px-5 sm:px-8 flex items-center justify-between border-b border-white/[0.06] bg-[#0a1124]/80 backdrop-blur-xl">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate('therapists')}
            className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition"
            title="Back to therapists"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-white">
              Therapy Session
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-xs text-emerald-300">
                Session in progress
              </span>
            </div>
          </div>
        </div>

        {/* CENTER TIMER */}

        <div className="absolute left-1/2 -translate-x-1/2">

          <div className="px-5 sm:px-7 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl text-center shadow-xl">

            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />

              <span className="text-base sm:text-lg font-bold tracking-wide">
                {formatTime(seconds)}
              </span>
            </div>

            <p className="hidden sm:block text-[10px] text-slate-400 mt-0.5">
              Session in progress
            </p>

          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-2">

          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-400/20 bg-emerald-400/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />

            <span className="text-[10px] font-bold text-emerald-300">
              PRIVATE & SECURE
            </span>
          </div>

          <button
            className="w-10 h-10 rounded-xl border border-purple-400/20 bg-purple-500/5 hover:bg-purple-500/10 flex items-center justify-center"
            title="Need help?"
          >
            <Sparkles className="w-5 h-5 text-purple-300" />
          </button>

        </div>
      </header>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="relative z-10 min-h-[calc(100vh-120px)] px-4 sm:px-8 lg:px-10 py-8 pb-40">

        <div className="max-w-[1450px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">

          {/* =================================================
              CENTER
          ================================================= */}

          <section className="flex flex-col items-center justify-center">

            {/* THERAPIST AVATAR */}

            <div className="relative">

              <div className="absolute inset-[-8px] rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 opacity-50 blur-md" />

              <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full p-[4px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500">

                <div className="w-full h-full rounded-full overflow-hidden bg-[#11182b] flex items-center justify-center">

                  {therapistImage ? (
                    <img
                      src={therapistImage}
                      alt={therapistName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserRound className="w-16 h-16 text-slate-400" />
                  )}

                </div>
              </div>

              {/* ONLINE DOT */}

              <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-emerald-400 border-[5px] border-[#070d1d] flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-[#063b2b]" />
              </div>

            </div>

            {/* CONNECTED */}

            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20">

              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-xs font-bold text-emerald-300">
                Connected
              </span>

            </div>

            {/* NAME */}

            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-center tracking-tight">
              {therapistName}
            </h1>

            <p className="mt-2 text-base sm:text-lg text-purple-200 text-center">
              {therapistTitle}
            </p>

            {/* RATING */}

            <div className="mt-3 flex items-center gap-2">

              <Star className="w-4 h-4 fill-purple-400 text-purple-400" />

              <span className="text-sm font-semibold">
                {therapistRating}
              </span>

              <span className="text-sm text-slate-500">
                ({therapistReviews} reviews)
              </span>

            </div>

            {/* QUICK INFO */}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

              <div className="min-w-[145px] px-5 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] backdrop-blur-xl">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <BriefcaseBusiness className="w-4 h-4 text-purple-300" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      {therapistExperience}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Experience
                    </p>
                  </div>
                </div>

              </div>

              <div className="min-w-[165px] px-5 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] backdrop-blur-xl">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-purple-300" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Verified
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Professional
                    </p>
                  </div>
                </div>

              </div>

              <div className="min-w-[165px] px-5 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] backdrop-blur-xl">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-purple-300" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Video Session
                    </p>

                    <p className="text-[10px] text-slate-500">
                      50 minutes
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* PRIVACY */}

            <div className="mt-7 flex items-center gap-3 text-sm text-slate-300">

              <Lock className="w-4 h-4 text-emerald-400" />

              <span>
                Everything you share is confidential and protected.
              </span>

            </div>

            {/* =================================================
                YOUR VIDEO
            ================================================= */}

            <div className="mt-8 w-full max-w-[340px] rounded-2xl border border-purple-400/20 bg-[#0c1327]/90 p-3 shadow-2xl">

              <div className="flex items-center justify-between px-2 pb-3">

                <span className="text-sm font-bold">
                  You
                </span>

                <MoreHorizontal className="w-5 h-5 text-slate-500" />

              </div>

              <div className="relative h-56 rounded-xl overflow-hidden bg-gradient-to-br from-[#17152d] to-[#10172a] border border-white/[0.06]">

                {cameraOn && !cameraError ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">

                    <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <UserRound className="w-9 h-9 text-purple-300" />
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      Camera is off
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Your video will appear here
                    </p>

                    <button
                      onClick={toggleCamera}
                      className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold hover:bg-emerald-400/20 transition"
                    >
                      <Camera className="w-4 h-4" />
                      Enable Camera
                    </button>

                  </div>
                )}

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[10px] font-semibold">
                  You
                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              THERAPIST SIDEBAR
          ================================================= */}

          <aside className="space-y-4">

            <div className="rounded-3xl border border-purple-400/20 bg-[#0c1327]/90 backdrop-blur-xl p-6 shadow-2xl">

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Your Therapist
                </h2>

                <MoreHorizontal className="w-5 h-5 text-slate-500" />
              </div>

              {/* PROFILE */}

              <div className="mt-5 flex items-center gap-4">

                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-400/40">

                  {therapistImage ? (
                    <img
                      src={therapistImage}
                      alt={therapistName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <UserRound className="w-7 h-7 text-slate-400" />
                    </div>
                  )}

                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0c1327]" />

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <h3 className="font-bold truncate">
                      {therapistName}
                    </h3>

                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />

                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {therapistTitle}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2">

                    <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />

                    <span className="text-xs font-semibold">
                      {therapistRating}
                    </span>

                    <span className="text-[10px] text-slate-500">
                      ({therapistReviews})
                    </span>

                  </div>

                </div>

              </div>

              <div className="h-px bg-white/[0.07] my-6" />

              {/* ABOUT */}

              <div>
                <h3 className="text-sm font-bold">
                  About
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Your therapist is here to listen, support you,
                  and help you work through your concerns in a
                  safe and confidential environment.
                </p>
              </div>

              {/* SPECIALIZATIONS */}

              <div className="mt-6">

                <h3 className="text-sm font-bold">
                  Specializations
                </h3>

                <div className="flex flex-wrap gap-2 mt-3">

                  {Array.isArray(therapistSpecializations) &&
                  therapistSpecializations.length > 0 ? (
                    therapistSpecializations
                      .slice(0, 6)
                      .map((item: any, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/10 text-[10px] text-purple-200"
                        >
                          {typeof item === 'string'
                            ? item
                            : item?.name || 'Mental Wellness'}
                        </span>
                      ))
                  ) : (
                    <>
                      <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-[10px] text-purple-200">
                        Anxiety
                      </span>

                      <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-[10px] text-purple-200">
                        Stress
                      </span>

                      <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-[10px] text-purple-200">
                        Depression
                      </span>
                    </>
                  )}

                </div>
              </div>

              <div className="h-px bg-white/[0.07] my-6" />

              {/* SESSION DETAILS */}

              <div>

                <h3 className="text-sm font-bold">
                  Session Details
                </h3>

                <div className="mt-4 space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Clock3 className="w-4 h-4 text-purple-300" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Session time
                      </p>

                      <p className="text-sm font-semibold mt-0.5">
                        50 Minutes
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-purple-300" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Session type
                      </p>

                      <p className="text-sm font-semibold mt-0.5">
                        Video Consultation
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* SAFE SPACE */}

              <div className="mt-6 p-4 rounded-2xl bg-purple-500/10 border border-purple-400/10">

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-300" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-purple-200">
                      You're in a safe space.
                    </p>

                    <p className="text-[10px] leading-4 text-slate-400 mt-1">
                      Take your time. Your therapist is here to
                      listen and support you.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* EMERGENCY SUPPORT */}

            <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.04] p-5">

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="text-sm font-bold text-red-400">
                    Emergency Support
                  </p>

                  <p className="text-xs leading-5 text-slate-400 mt-2">
                    If you are in crisis, please reach out to
                    emergency services or a trusted support
                    person.
                  </p>

                </div>

                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <PhoneOff className="w-4 h-4 text-red-400 rotate-[135deg]" />
                </div>

              </div>

            </div>

          </aside>

        </div>
      </main>

      {/* =====================================================
          BOTTOM CALL CONTROLS
      ===================================================== */}

      <div className="fixed xl:absolute bottom-0 left-0 right-0 z-40 p-4 sm:p-6">

        <div className="max-w-[900px] mx-auto">

          <div className="rounded-3xl border border-white/[0.08] bg-[#101729]/95 backdrop-blur-2xl shadow-2xl px-5 py-4">

            <div className="flex items-center justify-center gap-4 sm:gap-7">

              {/* MIC */}

              <div className="flex flex-col items-center gap-2">

                <button
                  onClick={toggleMic}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                    micOn
                      ? 'bg-white/[0.08] hover:bg-white/[0.14]'
                      : 'bg-red-500'
                  }`}
                  title={micOn ? 'Mute' : 'Unmute'}
                >
                  {micOn ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>

                <span className="hidden sm:block text-[10px] text-slate-400">
                  {micOn ? 'Mute' : 'Unmute'}
                </span>

              </div>

              {/* CAMERA */}

              <div className="flex flex-col items-center gap-2">

                <button
                  onClick={toggleCamera}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                    cameraOn
                      ? 'bg-white/[0.08] hover:bg-white/[0.14]'
                      : 'bg-white/[0.08]'
                  }`}
                  title={
                    cameraOn
                      ? 'Turn camera off'
                      : 'Start video'
                  }
                >
                  {cameraOn ? (
                    <Camera className="w-5 h-5" />
                  ) : (
                    <CameraOff className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                <span className="hidden sm:block text-[10px] text-slate-400">
                  {cameraOn ? 'Stop Video' : 'Start Video'}
                </span>

              </div>

              {/* SCREEN SHARE */}

              <div className="hidden sm:flex flex-col items-center gap-2">

                <button
                  className="w-14 h-14 rounded-full bg-white/[0.08] hover:bg-white/[0.14] flex items-center justify-center transition hover:scale-105"
                  title="Share screen"
                >
                  <ScreenShare className="w-5 h-5" />
                </button>

                <span className="text-[10px] text-slate-400">
                  Share Screen
                </span>

              </div>

              {/* CHAT */}

              <div className="hidden sm:flex flex-col items-center gap-2">

                <button
                  className="w-14 h-14 rounded-full bg-white/[0.08] hover:bg-white/[0.14] flex items-center justify-center transition hover:scale-105"
                  title="Chat"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>

                <span className="text-[10px] text-slate-400">
                  Chat
                </span>

              </div>

              {/* SPEAKER */}

              <div className="flex flex-col items-center gap-2">

                <button
                  onClick={() =>
                    setSpeakerOn((prev) => !prev)
                  }
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                    speakerOn
                      ? 'bg-white/[0.08] hover:bg-white/[0.14]'
                      : 'bg-red-500'
                  }`}
                  title={
                    speakerOn
                      ? 'Mute speaker'
                      : 'Turn speaker on'
                  }
                >
                  {speakerOn ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </button>

                <span className="hidden sm:block text-[10px] text-slate-400">
                  Speaker
                </span>

              </div>

              {/* END CALL */}

              <div className="flex flex-col items-center gap-2">

                <button
                  onClick={endCall}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-xl shadow-red-500/20 transition-all hover:scale-105"
                  title="End call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>

                <span className="hidden sm:block text-[10px] text-slate-400">
                  End Call
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              SESSION TIP
          ================================================= */}

          {showTip && (
            <div className="mt-3 rounded-2xl border border-purple-400/20 bg-[#11182b]/95 backdrop-blur-xl px-4 sm:px-5 py-3">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-purple-300" />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-xs font-bold text-purple-300">
                    Tip for a great session
                  </p>

                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                    Find a quiet space, stay comfortable, and feel
                    free to be yourself.
                  </p>

                </div>

                <button
                  onClick={() => setShowTip(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center"
                  title="Close"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          CAMERA ERROR
      ===================================================== */}

      {cameraError && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 max-w-sm px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl text-center">

          <p className="text-xs font-semibold text-red-300">
            Camera or microphone permission unavailable.
          </p>

          <p className="text-[10px] text-slate-400 mt-1">
            You can still continue your therapy session.
          </p>

        </div>
      )}

    </div>
  );
};

export default TherapistVideoCall;