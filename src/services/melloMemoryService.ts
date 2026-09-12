import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
import { MelloMemory } from '../types';
import { getFirebaseApp, isFirebaseConfigured } from './firebaseService';
import { storageService } from './storageService';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export type MelloMemoryData = Omit<MelloMemory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

const getLocalMemories = (userId: string): MelloMemory[] => {
  return storageService.getMelloMemories(userId);
};

const saveLocalMemories = (userId: string, memories: MelloMemory[]) => {
  storageService.saveMelloMemories(userId, memories);
};

const getMemoryCollection = (userId: string) => {
  const app = getFirebaseApp();
  if (!app || !isFirebaseConfigured()) return null;

  const authUser = getAuth(app).currentUser;
  if (!authUser || authUser.uid !== userId) return null;

  return collection(getFirestore(app), 'melloMemory', userId, 'items');
};

const toISOString = (value: Timestamp | string | undefined): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value.toDate === 'function') return value.toDate().toISOString();
  return new Date().toISOString();
};

const fromFirestore = (userId: string, id: string, data: Record<string, unknown>): MelloMemory => ({
  id,
  userId,
  category: (data.category as MelloMemory['category']) ?? 'pattern',
  value: String(data.value ?? ''),
  importance: Number(data.importance ?? 0.5),
  type: (data.type as MelloMemory['type']) ?? 'persistent',
  keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
  createdAt: toISOString(data.createdAt as Timestamp | string | undefined),
  updatedAt: toISOString(data.updatedAt as Timestamp | string | undefined),
});

export const fetchMemories = async (userId: string): Promise<MelloMemory[]> => {
  try {
    const memoryCollection = getMemoryCollection(userId);
    if (!memoryCollection) return getLocalMemories(userId);

    const snapshot = await getDocs(query(memoryCollection, orderBy('updatedAt', 'desc')));
    return snapshot.docs.map(document => fromFirestore(userId, document.id, document.data()));
  } catch (error) {
    console.warn('Mello memories unavailable; using local fallback.', error);
    return getLocalMemories(userId);
  }
};

export const saveMemory = async (
  userId: string,
  memoryData: MelloMemoryData
): Promise<MelloMemory> => {
  const normalized: MelloMemory = {
    ...memoryData,
    id: `memory-${Date.now()}`,
    userId,
    importance: Math.max(0, Math.min(1, memoryData.importance)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    return await saveMemoryToFirestore(userId, normalized);
  } catch (error) {
    console.warn('Mello memory save failed; using local fallback.', error);
    const memories = [normalized, ...getLocalMemories(userId)].slice(0, 20);
    saveLocalMemories(userId, memories);
    return normalized;
  }
};

const saveMemoryToFirestore = async (
  userId: string,
  memory: MelloMemory
): Promise<MelloMemory> => {
  const memoryCollection = getMemoryCollection(userId);
  if (!memoryCollection) throw new Error('Firestore is not available for this user.');

  const document = doc(memoryCollection);
  const firestoreMemory = {
    id: document.id,
    userId,
    category: memory.category,
    value: memory.value,
    importance: memory.importance,
    type: memory.type,
    keywords: memory.keywords,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(document, firestoreMemory);

  return { ...memory, id: document.id };
};

export const deleteMemory = async (userId: string, memoryId: string): Promise<void> => {
  try {
    const memoryCollection = getMemoryCollection(userId);
    if (!memoryCollection) throw new Error('Firestore is not available for this user.');
    await deleteDoc(doc(memoryCollection, memoryId));
  } catch (error) {
    console.warn('Mello memory delete failed; using local fallback.', error);
    saveLocalMemories(userId, getLocalMemories(userId).filter(memory => memory.id !== memoryId));
  }
};

export const clearAllMemories = async (userId: string): Promise<void> => {
  try {
    const memoryCollection = getMemoryCollection(userId);
    if (!memoryCollection) throw new Error('Firestore is not available for this user.');
    const snapshot = await getDocs(memoryCollection);
    const batch = writeBatch(getFirestore(getFirebaseApp()!));
    snapshot.docs.forEach(document => batch.delete(document.ref));
    await batch.commit();
  } catch (error) {
    console.warn('Mello memory clear failed; using local fallback.', error);
  }

  saveLocalMemories(userId, []);
};

export const migrateLegacyMemories = async (userId: string): Promise<MelloMemory[]> => {
  if (!getMemoryCollection(userId)) return [];

  const legacyMemories = [
    ...storageService.getLegacyMelloMemories(userId),
    ...storageService.getMelloMemories(userId),
  ];
  if (legacyMemories.length === 0) return [];

  try {
    const migrated: MelloMemory[] = [];
    for (const memory of legacyMemories) {
      const category = (memory.category as string) === 'recurring_concern'
        ? 'concern'
        : memory.category;
      migrated.push(await saveMemoryToFirestore(userId, {
        ...memory,
        userId,
        id: memory.id || `memory-${Date.now()}`,
        category,
        value: memory.value.slice(0, 500),
        importance: Math.max(0, Math.min(1, memory.importance)),
        type: memory.type ?? 'persistent',
        keywords: memory.keywords ?? [],
      }));
    }

    storageService.clearLegacyMelloMemories(userId);
    storageService.saveMelloMemories(userId, []);

    return migrated;
  } catch (error) {
    console.warn('Legacy Mello memory migration deferred.', error);
    return [];
  }
};

export const melloMemoryService = {
  fetchMemories,
  saveMemory,
  deleteMemory,
  clearAllMemories,
  migrateLegacyMemories,
};
