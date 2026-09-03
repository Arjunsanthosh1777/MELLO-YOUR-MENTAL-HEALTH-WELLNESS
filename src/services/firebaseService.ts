// Firebase Configuration & Service Abstraction
// Supports both live Firebase projects (when env variables are provided) 
// and seamless local state mock fallback for offline/demo operation.

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';

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
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private storage: FirebaseStorage | null = null;

  constructor() {
    this.isConfigured = isFirebaseConfigured();
    
    if (this.isConfigured) {
      const config = getFirebaseConfig();
      const app = initializeApp(config);
      this.auth = getAuth(app);
      this.db = getFirestore(app);
      this.storage = getStorage(app);
      
      // Connect to Firebase Emulator Suite if running locally
      if (window.location.hostname === 'localhost') {
        try {
          connectAuthEmulator(this.auth, 'http://localhost:9099');
          connectFirestoreEmulator(this.db, 'localhost', 8080);
          connectStorageEmulator(this.storage, 'localhost', 9199);
          console.log('🔌 Connected to Firebase Emulator Suite');
        } catch (error) {
          // Emulator may not be running - that's okay
          console.log('ℹ️ Firebase Emulator Suite not available (using live Firebase)');
        }
      }
      
      console.log('⚡ Firebase configured with project:', config.projectId);
    } else {
      console.log('ℹ️ Firebase running in Demo/Local Persistence mode.');
    }
  }

  public async signInWithEmail(email: string, password: string) {
    try {
      if (this.isConfigured && this.auth) {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || email.split('@')[0],
        };
      }
      // Demo mode
      return { uid: 'usr-' + Date.now(), email, displayName: email.split('@')[0] };
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  public async signUpWithEmail(email: string, password: string, name: string) {
    try {
      if (this.isConfigured && this.auth) {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: name,
        };
      }
      // Demo mode
      return { uid: 'usr-' + Date.now(), email, displayName: name };
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  public async signInWithGoogle() {
    try {
      if (this.isConfigured && this.auth) {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(this.auth, provider);
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
        };
      }
      // Demo mode
      return { uid: 'usr-google-' + Date.now(), email: 'google.user@mello.app', displayName: 'Google User' };
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    }
  }

  public async signOut() {
    try {
      if (this.isConfigured && this.auth) {
        await signOut(this.auth);
      }
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  public getAuth(): Auth | null {
    return this.auth;
  }

  public getDb(): Firestore | null {
    return this.db;
  }

  public getStorage(): FirebaseStorage | null {
    return this.storage;
  }

  public isConfiguredProperly(): boolean {
    return this.isConfigured;
  }
}

export const firebaseService = new FirebaseService();
