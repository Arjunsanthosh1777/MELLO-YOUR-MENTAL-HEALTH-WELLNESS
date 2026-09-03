import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProfile, MoodEntry, JournalEntry, JourneyLevel, Achievement, MoodType } from '../types';
import { storageService } from '../services/storageService';
import { dataConnectService } from '../services/dataConnectService';
import { firebaseService } from '../services/firebaseService';

export type AppTab = 
  | 'landing' 
  | 'auth' 
  | 'onboarding' 
  | 'home' 
  | 'talk' 
  | 'games' 
  | 'journey' 
  | 'activities' 
  | 'mood' 
  | 'journal' 
  | 'therapists' 
  | 'talk-now' 
  | 'privacy' 
  | 'profile' 
  | 'settings' 
  | 'safety' 
  | 'admin';

interface Toast {
  text: string;
  type: 'xp' | 'success' | 'info';
}

interface AppContextType {
  user: UserProfile;
  moods: MoodEntry[];
  journals: JournalEntry[];
  journey: JourneyLevel[];
  achievements: Achievement[];
  activeTab: AppTab;
  selectedGameId: string | null;
  selectedTherapistId: string | null;
  isSafetyModalOpen: boolean;
  toast: Toast | null;
  
  // Navigation & State Setters
  navigate: (tab: AppTab, options?: { gameId?: string; therapistId?: string }) => void;
  logMood: (mood: MoodType, note?: string, tags?: string[]) => void;
  clearMoods: () => void;
  addJournal: (title: string, content: string, mood?: MoodType, tags?: string[], prompt?: string) => void;
  deleteJournal: (id: string) => void;
  earnXP: (amount: number, reason: string) => void;
  completeNode: (levelId: number, nodeId: string) => void;
  updateUser: (fields: Partial<UserProfile>) => void;
  openSafetyModal: () => void;
  closeSafetyModal: () => void;
  showToast: (text: string, type?: 'xp' | 'success' | 'info') => void;
  resetDemoData: () => void;
  setIsDemoUser: (isDemo: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());
  const [moods, setMoods] = useState<MoodEntry[]>(() => storageService.getMoods());
  const [journals, setJournals] = useState<JournalEntry[]>(() => storageService.getJournals());
  const [journey, setJourney] = useState<JourneyLevel[]>(() => storageService.getJourney());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());
  const [cloudUserId, setCloudUserId] = useState<string | null>(null);
  const [cloudDataLoaded, setCloudDataLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState<AppTab>('landing');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Sync states to local storage
  useEffect(() => { storageService.saveUser(user); }, [user]);
  useEffect(() => { storageService.saveMoods(moods); }, [moods]);
  useEffect(() => { storageService.saveJournals(journals); }, [journals]);
  useEffect(() => { storageService.saveJourney(journey); }, [journey]);
  useEffect(() => { storageService.saveAchievements(achievements); }, [achievements]);

  useEffect(() => {
    const auth = firebaseService.getAuth();
    if (!auth) return;

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCloudUserId(null);
        setCloudDataLoaded(false);
        return;
      }

      setCloudUserId(firebaseUser.uid);
      try {
        const remote = await dataConnectService.loadUserData();
        if (remote.user) {
          setUser(prev => ({
            ...prev,
            id: firebaseUser.uid,
            email: remote.user?.email ?? firebaseUser.email ?? prev.email,
            name: remote.user?.displayName ?? firebaseUser.displayName ?? prev.name,
            avatar: remote.user?.avatar ?? prev.avatar,
          }));
        }
        setMoods(remote.moods);
        setJournals(remote.journals);
      } catch (error) {
        console.warn('Cloud data unavailable; continuing with local cache.', error);
      } finally {
        setCloudDataLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!cloudUserId || !cloudDataLoaded) return;
    void dataConnectService.saveUser(user).catch(error => {
      console.warn('Could not save profile to cloud.', error);
    });
  }, [cloudDataLoaded, cloudUserId, user]);

  const showToast = (text: string, type: 'xp' | 'success' | 'info' = 'info') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const navigate = (tab: AppTab, options?: { gameId?: string; therapistId?: string }) => {
    setActiveTab(tab);
    if (options?.gameId) setSelectedGameId(options.gameId);
    if (options?.therapistId) setSelectedTherapistId(options.therapistId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const earnXP = (amount: number, reason: string) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newPoints = prev.mindPoints + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      if (newLevel > prev.level) {
        showToast(`🎉 Level Up! You reached Level ${newLevel}!`, 'success');
      } else {
        showToast(`+${amount} XP earned for ${reason}!`, 'xp');
      }

      return {
        ...prev,
        xp: newXP,
        mindPoints: newPoints,
        level: newLevel
      };
    });
  };

  const logMood = (mood: MoodType, note?: string, tags: string[] = []) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = {
      id: 'm-' + Date.now(),
      userId: user.id,
      date: todayStr,
      timestamp: new Date().toISOString(),
      mood,
      note,
      tags
    };

    setMoods(prev => [newEntry, ...prev.filter(m => m.date !== todayStr)]);
    if (cloudUserId) {
      void dataConnectService.saveMood(newEntry).catch(error => console.warn('Could not save mood to cloud.', error));
    }
    earnXP(10, 'Daily Mood Check-in');
  };

  const addJournal = (title: string, content: string, mood?: MoodType, tags: string[] = [], prompt?: string) => {
    const newJournal: JournalEntry = {
      id: 'j-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      title,
      content,
      mood,
      tags,
      prompt
    };
    setJournals(prev => [newJournal, ...prev]);
    if (cloudUserId) {
      void dataConnectService.saveJournal(newJournal).catch(error => console.warn('Could not save journal to cloud.', error));
    }
    earnXP(20, 'Journal Reflection');
  };

  const deleteJournal = (id: string) => {
    setJournals(prev => prev.filter(j => j.id !== id));
    if (cloudUserId) {
      void dataConnectService.removeJournal(id).catch(error => console.warn('Could not delete journal from cloud.', error));
    }
    showToast('Journal entry deleted permanently.', 'info');
  };

  const clearMoods = () => {
    setMoods([]);
    if (cloudUserId) {
      void dataConnectService.clearMoods().catch(error => console.warn('Could not clear cloud moods.', error));
    }
    showToast('Your seven-day mood view is fresh again.', 'success');
  };

  const completeNode = (levelId: number, nodeId: string) => {
    setJourney(prev => prev.map(level => {
      if (level.id !== levelId) return level;
      return {
        ...level,
        nodes: level.nodes.map(n => n.id === nodeId ? { ...n, completed: true } : n)
      };
    }));
    earnXP(15, 'Journey Activity');
  };

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...fields }));
  };

  const openSafetyModal = () => setIsSafetyModalOpen(true);
  const closeSafetyModal = () => setIsSafetyModalOpen(false);

  const resetDemoData = () => {
    storageService.resetDemoData();
    setUser(storageService.getUser());
    setMoods(storageService.getMoods());
    setJournals(storageService.getJournals());
    setJourney(storageService.getJourney());
    setAchievements(storageService.getAchievements());
    showToast('Demo data reset to default state.', 'info');
  };

  const setIsDemoUser = (isDemo: boolean) => {
    if (isDemo) {
      setUser(prev => ({ ...prev, name: 'Arjun', onboardingCompleted: true }));
      navigate('home');
      showToast('Switched to Demo User (Arjun)', 'success');
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      moods,
      journals,
      journey,
      achievements,
      activeTab,
      selectedGameId,
      selectedTherapistId,
      isSafetyModalOpen,
      toast,
      navigate,
      logMood,
      clearMoods,
      addJournal,
      deleteJournal,
      earnXP,
      completeNode,
      updateUser,
      openSafetyModal,
      closeSafetyModal,
      showToast,
      resetDemoData,
      setIsDemoUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
