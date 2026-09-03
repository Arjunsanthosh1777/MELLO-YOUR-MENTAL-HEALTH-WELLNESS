import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Activity_Key {
  id: UUIDString;
  __typename?: 'Activity_Key';
}

export interface ClearUserMoodsData {
  mood_delete?: Mood_Key | null;
}

export interface CreateJournalEntryData {
  journalEntry_insert: JournalEntry_Key;
}

export interface CreateJournalEntryVariables {
  title: string;
  content: string;
  tags?: string | null;
}

export interface DeleteJournalEntryData {
  journalEntry_delete?: JournalEntry_Key | null;
}

export interface DeleteJournalEntryVariables {
  entryId: UUIDString;
}

export interface GetJournalEntryData {
  journalEntry?: {
    id: UUIDString;
    title: string;
    content: string;
    tags?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    user: {
      id: string;
    } & User_Key;
  } & JournalEntry_Key;
}

export interface GetJournalEntryVariables {
  entryId: UUIDString;
}

export interface GetLatestSafetyCheckInData {
  user?: {
    id: string;
    checkIns: ({
      id: UUIDString;
      status: string;
      message?: string | null;
      checkedAt: TimestampString;
      reviewDate?: TimestampString | null;
    } & SafetyCheckIn_Key)[];
  } & User_Key;
}

export interface GetMoodStatsData {
  user?: {
    id: string;
    allMoods: ({
      id: UUIDString;
      mood: string;
      intensity?: number | null;
      timestamp: TimestampString;
    } & Mood_Key)[];
  } & User_Key;
}

export interface GetUserProfileData {
  user?: {
    id: string;
    email: string;
    displayName?: string | null;
    avatar?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key;
}

export interface JournalEntry_Key {
  id: UUIDString;
  __typename?: 'JournalEntry_Key';
}

export interface ListActivitiesData {
  user?: {
    id: string;
    activities: ({
      id: UUIDString;
      activityType: string;
      duration?: number | null;
      score?: number | null;
      completedAt: TimestampString;
    } & Activity_Key)[];
  } & User_Key;
}

export interface ListJournalEntriesData {
  user?: {
    id: string;
    entries: ({
      id: UUIDString;
      title: string;
      content: string;
      tags?: string | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
    } & JournalEntry_Key)[];
  } & User_Key;
}

export interface ListTherapySessionsData {
  user?: {
    id: string;
    sessions: ({
      id: UUIDString;
      therapist?: string | null;
      sessionDate?: TimestampString | null;
      duration?: number | null;
      notes?: string | null;
      status?: string | null;
      createdAt: TimestampString;
    } & TherapySession_Key)[];
  } & User_Key;
}

export interface ListUserMoodsData {
  user?: {
    id: string;
    recentMoods: ({
      id: UUIDString;
      mood: string;
      intensity?: number | null;
      notes?: string | null;
      timestamp: TimestampString;
    } & Mood_Key)[];
  } & User_Key;
}

export interface LogActivityData {
  activity_insert: Activity_Key;
}

export interface LogActivityVariables {
  activityType: string;
  duration?: number | null;
  score?: number | null;
}

export interface LogMoodData {
  mood_insert: Mood_Key;
}

export interface LogMoodVariables {
  mood: string;
  intensity?: number | null;
  notes?: string | null;
}

export interface Mood_Key {
  id: UUIDString;
  __typename?: 'Mood_Key';
}

export interface RecordSafetyCheckInData {
  safetyCheckIn_insert: SafetyCheckIn_Key;
}

export interface RecordSafetyCheckInVariables {
  status: string;
  message?: string | null;
  reviewDate?: TimestampString | null;
}

export interface SafetyCheckIn_Key {
  id: UUIDString;
  __typename?: 'SafetyCheckIn_Key';
}

export interface TherapySession_Key {
  id: UUIDString;
  __typename?: 'TherapySession_Key';
}

export interface UpdateJournalEntryData {
  journalEntry_update?: JournalEntry_Key | null;
}

export interface UpdateJournalEntryVariables {
  entryId: UUIDString;
  title?: string | null;
  content?: string | null;
  tags?: string | null;
}

export interface UpsertTherapySessionData {
  therapySession_upsert: TherapySession_Key;
}

export interface UpsertTherapySessionVariables {
  sessionId?: UUIDString | null;
  therapist?: string | null;
  sessionDate?: TimestampString | null;
  duration?: number | null;
  notes?: string | null;
  status?: string | null;
}

export interface UpsertUserProfileData {
  user_upsert: User_Key;
}

export interface UpsertUserProfileVariables {
  email: string;
  displayName?: string | null;
  avatar?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface UpsertUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  operationName: string;
}
export const upsertUserProfileRef: UpsertUserProfileRef;

export function upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;
export function upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface LogMoodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogMoodVariables): MutationRef<LogMoodData, LogMoodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogMoodVariables): MutationRef<LogMoodData, LogMoodVariables>;
  operationName: string;
}
export const logMoodRef: LogMoodRef;

export function logMood(vars: LogMoodVariables): MutationPromise<LogMoodData, LogMoodVariables>;
export function logMood(dc: DataConnect, vars: LogMoodVariables): MutationPromise<LogMoodData, LogMoodVariables>;

interface ClearUserMoodsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<ClearUserMoodsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<ClearUserMoodsData, undefined>;
  operationName: string;
}
export const clearUserMoodsRef: ClearUserMoodsRef;

export function clearUserMoods(): MutationPromise<ClearUserMoodsData, undefined>;
export function clearUserMoods(dc: DataConnect): MutationPromise<ClearUserMoodsData, undefined>;

interface CreateJournalEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJournalEntryVariables): MutationRef<CreateJournalEntryData, CreateJournalEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateJournalEntryVariables): MutationRef<CreateJournalEntryData, CreateJournalEntryVariables>;
  operationName: string;
}
export const createJournalEntryRef: CreateJournalEntryRef;

export function createJournalEntry(vars: CreateJournalEntryVariables): MutationPromise<CreateJournalEntryData, CreateJournalEntryVariables>;
export function createJournalEntry(dc: DataConnect, vars: CreateJournalEntryVariables): MutationPromise<CreateJournalEntryData, CreateJournalEntryVariables>;

interface UpdateJournalEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJournalEntryVariables): MutationRef<UpdateJournalEntryData, UpdateJournalEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateJournalEntryVariables): MutationRef<UpdateJournalEntryData, UpdateJournalEntryVariables>;
  operationName: string;
}
export const updateJournalEntryRef: UpdateJournalEntryRef;

export function updateJournalEntry(vars: UpdateJournalEntryVariables): MutationPromise<UpdateJournalEntryData, UpdateJournalEntryVariables>;
export function updateJournalEntry(dc: DataConnect, vars: UpdateJournalEntryVariables): MutationPromise<UpdateJournalEntryData, UpdateJournalEntryVariables>;

interface DeleteJournalEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJournalEntryVariables): MutationRef<DeleteJournalEntryData, DeleteJournalEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteJournalEntryVariables): MutationRef<DeleteJournalEntryData, DeleteJournalEntryVariables>;
  operationName: string;
}
export const deleteJournalEntryRef: DeleteJournalEntryRef;

export function deleteJournalEntry(vars: DeleteJournalEntryVariables): MutationPromise<DeleteJournalEntryData, DeleteJournalEntryVariables>;
export function deleteJournalEntry(dc: DataConnect, vars: DeleteJournalEntryVariables): MutationPromise<DeleteJournalEntryData, DeleteJournalEntryVariables>;

interface LogActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogActivityVariables): MutationRef<LogActivityData, LogActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogActivityVariables): MutationRef<LogActivityData, LogActivityVariables>;
  operationName: string;
}
export const logActivityRef: LogActivityRef;

export function logActivity(vars: LogActivityVariables): MutationPromise<LogActivityData, LogActivityVariables>;
export function logActivity(dc: DataConnect, vars: LogActivityVariables): MutationPromise<LogActivityData, LogActivityVariables>;

interface UpsertTherapySessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertTherapySessionVariables): MutationRef<UpsertTherapySessionData, UpsertTherapySessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpsertTherapySessionVariables): MutationRef<UpsertTherapySessionData, UpsertTherapySessionVariables>;
  operationName: string;
}
export const upsertTherapySessionRef: UpsertTherapySessionRef;

export function upsertTherapySession(vars?: UpsertTherapySessionVariables): MutationPromise<UpsertTherapySessionData, UpsertTherapySessionVariables>;
export function upsertTherapySession(dc: DataConnect, vars?: UpsertTherapySessionVariables): MutationPromise<UpsertTherapySessionData, UpsertTherapySessionVariables>;

interface RecordSafetyCheckInRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordSafetyCheckInVariables): MutationRef<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordSafetyCheckInVariables): MutationRef<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;
  operationName: string;
}
export const recordSafetyCheckInRef: RecordSafetyCheckInRef;

export function recordSafetyCheckIn(vars: RecordSafetyCheckInVariables): MutationPromise<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;
export function recordSafetyCheckIn(dc: DataConnect, vars: RecordSafetyCheckInVariables): MutationPromise<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;
export function getUserProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface ListUserMoodsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserMoodsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserMoodsData, undefined>;
  operationName: string;
}
export const listUserMoodsRef: ListUserMoodsRef;

export function listUserMoods(options?: ExecuteQueryOptions): QueryPromise<ListUserMoodsData, undefined>;
export function listUserMoods(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserMoodsData, undefined>;

interface GetMoodStatsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMoodStatsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMoodStatsData, undefined>;
  operationName: string;
}
export const getMoodStatsRef: GetMoodStatsRef;

export function getMoodStats(options?: ExecuteQueryOptions): QueryPromise<GetMoodStatsData, undefined>;
export function getMoodStats(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMoodStatsData, undefined>;

interface ListJournalEntriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJournalEntriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListJournalEntriesData, undefined>;
  operationName: string;
}
export const listJournalEntriesRef: ListJournalEntriesRef;

export function listJournalEntries(options?: ExecuteQueryOptions): QueryPromise<ListJournalEntriesData, undefined>;
export function listJournalEntries(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJournalEntriesData, undefined>;

interface GetJournalEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJournalEntryVariables): QueryRef<GetJournalEntryData, GetJournalEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetJournalEntryVariables): QueryRef<GetJournalEntryData, GetJournalEntryVariables>;
  operationName: string;
}
export const getJournalEntryRef: GetJournalEntryRef;

export function getJournalEntry(vars: GetJournalEntryVariables, options?: ExecuteQueryOptions): QueryPromise<GetJournalEntryData, GetJournalEntryVariables>;
export function getJournalEntry(dc: DataConnect, vars: GetJournalEntryVariables, options?: ExecuteQueryOptions): QueryPromise<GetJournalEntryData, GetJournalEntryVariables>;

interface ListActivitiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListActivitiesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListActivitiesData, undefined>;
  operationName: string;
}
export const listActivitiesRef: ListActivitiesRef;

export function listActivities(options?: ExecuteQueryOptions): QueryPromise<ListActivitiesData, undefined>;
export function listActivities(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListActivitiesData, undefined>;

interface ListTherapySessionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTherapySessionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTherapySessionsData, undefined>;
  operationName: string;
}
export const listTherapySessionsRef: ListTherapySessionsRef;

export function listTherapySessions(options?: ExecuteQueryOptions): QueryPromise<ListTherapySessionsData, undefined>;
export function listTherapySessions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTherapySessionsData, undefined>;

interface GetLatestSafetyCheckInRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetLatestSafetyCheckInData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetLatestSafetyCheckInData, undefined>;
  operationName: string;
}
export const getLatestSafetyCheckInRef: GetLatestSafetyCheckInRef;

export function getLatestSafetyCheckIn(options?: ExecuteQueryOptions): QueryPromise<GetLatestSafetyCheckInData, undefined>;
export function getLatestSafetyCheckIn(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetLatestSafetyCheckInData, undefined>;

