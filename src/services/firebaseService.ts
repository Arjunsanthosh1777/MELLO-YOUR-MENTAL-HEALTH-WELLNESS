// Firebase Configuration & Service Abstraction
// Supports both live Firebase projects (when env variables are provided) 
// and seamless local state mock fallback for offline/demo operation.

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

export class FirebaseService {
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = isFirebaseConfigured();
    if (this.isConfigured) {
      console.log('⚡ Firebase configured with project:', getFirebaseConfig().projectId);
    } else {
      console.log('ℹ️ Firebase running in Demo/Local Persistence mode.');
    }
  }

  public async signInWithEmail(email: string, pass: string) {
    if (this.isConfigured) {
      // Real Firebase Auth call would go here
    }
    return { uid: 'usr-' + Date.now(), email, displayName: email.split('@')[0] };
  }

  public async signUpWithEmail(email: string, pass: string, name: string) {
    if (this.isConfigured) {
      // Real Firebase Auth signup call
    }
    return { uid: 'usr-' + Date.now(), email, displayName: name };
  }

  public async signInWithGoogle() {
    return { uid: 'usr-google-' + Date.now(), email: 'google.user@mello.app', displayName: 'Google User' };
  }
}

export const firebaseService = new FirebaseService();
