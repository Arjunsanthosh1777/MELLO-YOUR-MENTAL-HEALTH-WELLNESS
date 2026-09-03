import { UpsertUserProfileData, UpsertUserProfileVariables, LogMoodData, LogMoodVariables, CreateJournalEntryData, CreateJournalEntryVariables, UpdateJournalEntryData, UpdateJournalEntryVariables, DeleteJournalEntryData, DeleteJournalEntryVariables, LogActivityData, LogActivityVariables, UpsertTherapySessionData, UpsertTherapySessionVariables, RecordSafetyCheckInData, RecordSafetyCheckInVariables, GetUserProfileData, ListUserMoodsData, GetMoodStatsData, ListJournalEntriesData, GetJournalEntryData, GetJournalEntryVariables, ListActivitiesData, ListTherapySessionsData, GetLatestSafetyCheckInData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertUserProfile(options?: useDataConnectMutationOptions<UpsertUserProfileData, FirebaseError, UpsertUserProfileVariables>): UseDataConnectMutationResult<UpsertUserProfileData, UpsertUserProfileVariables>;
export function useUpsertUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserProfileData, FirebaseError, UpsertUserProfileVariables>): UseDataConnectMutationResult<UpsertUserProfileData, UpsertUserProfileVariables>;

export function useLogMood(options?: useDataConnectMutationOptions<LogMoodData, FirebaseError, LogMoodVariables>): UseDataConnectMutationResult<LogMoodData, LogMoodVariables>;
export function useLogMood(dc: DataConnect, options?: useDataConnectMutationOptions<LogMoodData, FirebaseError, LogMoodVariables>): UseDataConnectMutationResult<LogMoodData, LogMoodVariables>;

export function useCreateJournalEntry(options?: useDataConnectMutationOptions<CreateJournalEntryData, FirebaseError, CreateJournalEntryVariables>): UseDataConnectMutationResult<CreateJournalEntryData, CreateJournalEntryVariables>;
export function useCreateJournalEntry(dc: DataConnect, options?: useDataConnectMutationOptions<CreateJournalEntryData, FirebaseError, CreateJournalEntryVariables>): UseDataConnectMutationResult<CreateJournalEntryData, CreateJournalEntryVariables>;

export function useUpdateJournalEntry(options?: useDataConnectMutationOptions<UpdateJournalEntryData, FirebaseError, UpdateJournalEntryVariables>): UseDataConnectMutationResult<UpdateJournalEntryData, UpdateJournalEntryVariables>;
export function useUpdateJournalEntry(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateJournalEntryData, FirebaseError, UpdateJournalEntryVariables>): UseDataConnectMutationResult<UpdateJournalEntryData, UpdateJournalEntryVariables>;

export function useDeleteJournalEntry(options?: useDataConnectMutationOptions<DeleteJournalEntryData, FirebaseError, DeleteJournalEntryVariables>): UseDataConnectMutationResult<DeleteJournalEntryData, DeleteJournalEntryVariables>;
export function useDeleteJournalEntry(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteJournalEntryData, FirebaseError, DeleteJournalEntryVariables>): UseDataConnectMutationResult<DeleteJournalEntryData, DeleteJournalEntryVariables>;

export function useLogActivity(options?: useDataConnectMutationOptions<LogActivityData, FirebaseError, LogActivityVariables>): UseDataConnectMutationResult<LogActivityData, LogActivityVariables>;
export function useLogActivity(dc: DataConnect, options?: useDataConnectMutationOptions<LogActivityData, FirebaseError, LogActivityVariables>): UseDataConnectMutationResult<LogActivityData, LogActivityVariables>;

export function useUpsertTherapySession(options?: useDataConnectMutationOptions<UpsertTherapySessionData, FirebaseError, UpsertTherapySessionVariables | void>): UseDataConnectMutationResult<UpsertTherapySessionData, UpsertTherapySessionVariables>;
export function useUpsertTherapySession(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertTherapySessionData, FirebaseError, UpsertTherapySessionVariables | void>): UseDataConnectMutationResult<UpsertTherapySessionData, UpsertTherapySessionVariables>;

export function useRecordSafetyCheckIn(options?: useDataConnectMutationOptions<RecordSafetyCheckInData, FirebaseError, RecordSafetyCheckInVariables>): UseDataConnectMutationResult<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;
export function useRecordSafetyCheckIn(dc: DataConnect, options?: useDataConnectMutationOptions<RecordSafetyCheckInData, FirebaseError, RecordSafetyCheckInVariables>): UseDataConnectMutationResult<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;

export function useGetUserProfile(options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, undefined>;
export function useGetUserProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, undefined>;

export function useListUserMoods(options?: useDataConnectQueryOptions<ListUserMoodsData>): UseDataConnectQueryResult<ListUserMoodsData, undefined>;
export function useListUserMoods(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserMoodsData>): UseDataConnectQueryResult<ListUserMoodsData, undefined>;

export function useGetMoodStats(options?: useDataConnectQueryOptions<GetMoodStatsData>): UseDataConnectQueryResult<GetMoodStatsData, undefined>;
export function useGetMoodStats(dc: DataConnect, options?: useDataConnectQueryOptions<GetMoodStatsData>): UseDataConnectQueryResult<GetMoodStatsData, undefined>;

export function useListJournalEntries(options?: useDataConnectQueryOptions<ListJournalEntriesData>): UseDataConnectQueryResult<ListJournalEntriesData, undefined>;
export function useListJournalEntries(dc: DataConnect, options?: useDataConnectQueryOptions<ListJournalEntriesData>): UseDataConnectQueryResult<ListJournalEntriesData, undefined>;

export function useGetJournalEntry(vars: GetJournalEntryVariables, options?: useDataConnectQueryOptions<GetJournalEntryData>): UseDataConnectQueryResult<GetJournalEntryData, GetJournalEntryVariables>;
export function useGetJournalEntry(dc: DataConnect, vars: GetJournalEntryVariables, options?: useDataConnectQueryOptions<GetJournalEntryData>): UseDataConnectQueryResult<GetJournalEntryData, GetJournalEntryVariables>;

export function useListActivities(options?: useDataConnectQueryOptions<ListActivitiesData>): UseDataConnectQueryResult<ListActivitiesData, undefined>;
export function useListActivities(dc: DataConnect, options?: useDataConnectQueryOptions<ListActivitiesData>): UseDataConnectQueryResult<ListActivitiesData, undefined>;

export function useListTherapySessions(options?: useDataConnectQueryOptions<ListTherapySessionsData>): UseDataConnectQueryResult<ListTherapySessionsData, undefined>;
export function useListTherapySessions(dc: DataConnect, options?: useDataConnectQueryOptions<ListTherapySessionsData>): UseDataConnectQueryResult<ListTherapySessionsData, undefined>;

export function useGetLatestSafetyCheckIn(options?: useDataConnectQueryOptions<GetLatestSafetyCheckInData>): UseDataConnectQueryResult<GetLatestSafetyCheckInData, undefined>;
export function useGetLatestSafetyCheckIn(dc: DataConnect, options?: useDataConnectQueryOptions<GetLatestSafetyCheckInData>): UseDataConnectQueryResult<GetLatestSafetyCheckInData, undefined>;
