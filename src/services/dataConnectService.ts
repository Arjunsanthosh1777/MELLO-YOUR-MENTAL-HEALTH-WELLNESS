import { getDataConnect, DataConnect } from 'firebase/data-connect';
import {
  connectorConfig,
  createJournalEntry,
  deleteJournalEntry,
  getUserProfile,
  listJournalEntries,
  listUserMoods,
  logMood,
  upsertUserProfile,
} from '../dataconnect-generated';
import { JournalEntry, MoodEntry, MoodType, UserProfile } from '../types';
import { firebaseService } from './firebaseService';

class DataConnectService {
  private client: DataConnect | null = null;

  private getClient(): DataConnect | null {
    if (!firebaseService.isConfiguredProperly()) return null;
    if (!this.client) this.client = getDataConnect(connectorConfig);
    return this.client;
  }

  public isAvailable(): boolean {
    return this.getClient() !== null && firebaseService.getAuth()?.currentUser !== null;
  }

  public async saveUser(user: UserProfile): Promise<void> {
    const client = this.getClient();
    if (!client || !user.email) return;
    await upsertUserProfile(client, {
      email: user.email,
      displayName: user.name,
      avatar: user.avatar,
    });
  }

  public async loadUserData(): Promise<{
    user?: { email: string; displayName?: string | null; avatar?: string | null };
    moods: MoodEntry[];
    journals: JournalEntry[];
  }> {
    const client = this.getClient();
    if (!client) return { moods: [], journals: [] };

    const [profileResult, moodsResult, journalsResult] = await Promise.all([
      getUserProfile(client),
      listUserMoods(client),
      listJournalEntries(client),
    ]);

    const remoteMoods = moodsResult.data.user?.recentMoods ?? [];
    const remoteJournals = journalsResult.data.user?.entries ?? [];

    return {
      user: profileResult.data.user,
      moods: remoteMoods.map((mood) => ({
        id: mood.id,
        userId: firebaseService.getAuth()?.currentUser?.uid ?? '',
        date: mood.timestamp.split('T')[0],
        timestamp: mood.timestamp,
        mood: mood.mood as MoodType,
        note: mood.notes ?? undefined,
        tags: [],
      })),
      journals: remoteJournals.map((entry) => ({
        id: entry.id,
        date: entry.createdAt.split('T')[0],
        timestamp: entry.createdAt,
        title: entry.title,
        content: entry.content,
        tags: entry.tags ? entry.tags.split(',').filter(Boolean) : [],
      })),
    };
  }

  public async saveMood(mood: MoodEntry): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    await logMood(client, {
      mood: mood.mood,
      notes: mood.note,
    });
  }

  public async saveJournal(journal: JournalEntry): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    await createJournalEntry(client, {
      title: journal.title,
      content: journal.content,
      tags: journal.tags.join(','),
    });
  }

  public async removeJournal(id: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    await deleteJournalEntry(client, { entryId: id });
  }
}

export const dataConnectService = new DataConnectService();
