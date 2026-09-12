// Firebase Configuration & Service Abstraction
// Supports both live Firebase projects (when env variables are provided)
// and seamless local state mock fallback for offline/demo operation.

import {
  initializeApp,
  getApps,
  FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from 'firebase/auth';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const getFirebaseConfig = (): FirebaseConfig => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
};

export const isFirebaseConfigured = (): boolean => {
  const cfg = getFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId);
};

export const getFirebaseApp = (): FirebaseApp | null => {
  return getApps()[0] ?? null;
};

export class FirebaseService {
  private isConfigured: boolean;
  private app: FirebaseApp | null = null;
  private phoneConfirmation: ConfirmationResult | null = null;
  private phoneRecaptcha: RecaptchaVerifier | null = null;
  private authState: {
    currentUser: {
      uid?: string;
      email?: string | null;
      displayName?: string | null;
      photoURL?: string | null;
    } | null;
  };

  constructor() {
    this.isConfigured = isFirebaseConfigured();
    this.authState = { currentUser: null };

    if (this.isConfigured) {
      this.app = getApps().length ? getApps()[0] : initializeApp(getFirebaseConfig());
      console.log('⚡ Firebase configured with project:', getFirebaseConfig().projectId);
    } else {
      console.log('ℹ️ Firebase running in Demo/Local Persistence mode.');
    }
  }

  public isConfiguredProperly(): boolean {
    return this.isConfigured;
  }

  public getAuth(): { currentUser: { uid?: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null } | null {
    return this.authState;
  }

  private syncAuthUser(user: User | null) {
    if (!user) {
      this.authState.currentUser = null;
      return;
    }

    this.authState.currentUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }

  public async signInWithEmail(email: string, pass: string) {
    if (this.isConfigured && this.app) {
      const auth = getAuth(this.app);
      const result = await signInWithEmailAndPassword(auth, email, pass);
      this.syncAuthUser(result.user);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        avatar: result.user.photoURL,
      };
    }

    this.authState.currentUser = { uid: 'usr-' + Date.now() };
    return { uid: this.authState.currentUser.uid, email, displayName: email.split('@')[0] };
  }

  public async signUpWithEmail(email: string, pass: string, name: string) {
    if (this.isConfigured && this.app) {
      const auth = getAuth(this.app);
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && auth.currentUser) {
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(auth.currentUser, { displayName: name });
      }
      this.syncAuthUser(result.user);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName ?? name,
        avatar: result.user.photoURL,
      };
    }

    this.authState.currentUser = { uid: 'usr-' + Date.now() };
    return { uid: this.authState.currentUser.uid, email, displayName: name };
  }

  public async signInWithGoogle() {
    if (this.isConfigured && this.app) {
      const auth = getAuth(this.app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      this.syncAuthUser(result.user);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        avatar: result.user.photoURL,
      };
    }

    this.authState.currentUser = { uid: 'usr-google-' + Date.now(), email: 'google.user@mello.app', displayName: 'Google User' };
    return {
      uid: this.authState.currentUser.uid,
      email: this.authState.currentUser.email,
      displayName: this.authState.currentUser.displayName,
      avatar: this.authState.currentUser.photoURL,
    };
  }

  public async sendPhoneCode(phoneNumber: string, recaptchaContainerId: string): Promise<void> {
    if (!this.isConfigured || !this.app) {
      throw new Error('Phone authentication is unavailable in demo mode.');
    }

    const auth = getAuth(this.app);
    this.phoneRecaptcha?.clear();
    this.phoneRecaptcha = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
    });
    this.phoneConfirmation = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      this.phoneRecaptcha
    );
  }

  public async confirmPhoneCode(code: string) {
    if (!this.phoneConfirmation) {
      throw new Error('Request a verification code first.');
    }

    const result = await this.phoneConfirmation.confirm(code);
    this.syncAuthUser(result.user);
    this.phoneConfirmation = null;
    this.phoneRecaptcha?.clear();
    this.phoneRecaptcha = null;

    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      avatar: result.user.photoURL,
      phoneNumber: result.user.phoneNumber,
    };
  }
}

export const firebaseService = new FirebaseService();
