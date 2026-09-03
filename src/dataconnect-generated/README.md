# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserProfile*](#getuserprofile)
  - [*ListUserMoods*](#listusermoods)
  - [*GetMoodStats*](#getmoodstats)
  - [*ListJournalEntries*](#listjournalentries)
  - [*GetJournalEntry*](#getjournalentry)
  - [*ListActivities*](#listactivities)
  - [*ListTherapySessions*](#listtherapysessions)
  - [*GetLatestSafetyCheckIn*](#getlatestsafetycheckin)
- [**Mutations**](#mutations)
  - [*UpsertUserProfile*](#upsertuserprofile)
  - [*LogMood*](#logmood)
  - [*ClearRecentUserMoods*](#clearrecentusermoods)
  - [*CreateJournalEntry*](#createjournalentry)
  - [*UpdateJournalEntry*](#updatejournalentry)
  - [*DeleteJournalEntry*](#deletejournalentry)
  - [*LogActivity*](#logactivity)
  - [*UpsertTherapySession*](#upserttherapysession)
  - [*RecordSafetyCheckIn*](#recordsafetycheckin)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserProfile(options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query has no variables.
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile } from '@dataconnect/generated';


// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef } from '@dataconnect/generated';


// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUserMoods
You can execute the `ListUserMoods` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserMoods(options?: ExecuteQueryOptions): QueryPromise<ListUserMoodsData, undefined>;

interface ListUserMoodsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserMoodsData, undefined>;
}
export const listUserMoodsRef: ListUserMoodsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserMoods(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserMoodsData, undefined>;

interface ListUserMoodsRef {
  ...
  (dc: DataConnect): QueryRef<ListUserMoodsData, undefined>;
}
export const listUserMoodsRef: ListUserMoodsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserMoodsRef:
```typescript
const name = listUserMoodsRef.operationName;
console.log(name);
```

### Variables
The `ListUserMoods` query has no variables.
### Return Type
Recall that executing the `ListUserMoods` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserMoodsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListUserMoods`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserMoods } from '@dataconnect/generated';


// Call the `listUserMoods()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserMoods();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserMoods(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
listUserMoods().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `ListUserMoods`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserMoodsRef } from '@dataconnect/generated';


// Call the `listUserMoodsRef()` function to get a reference to the query.
const ref = listUserMoodsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserMoodsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetMoodStats
You can execute the `GetMoodStats` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMoodStats(options?: ExecuteQueryOptions): QueryPromise<GetMoodStatsData, undefined>;

interface GetMoodStatsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMoodStatsData, undefined>;
}
export const getMoodStatsRef: GetMoodStatsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMoodStats(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMoodStatsData, undefined>;

interface GetMoodStatsRef {
  ...
  (dc: DataConnect): QueryRef<GetMoodStatsData, undefined>;
}
export const getMoodStatsRef: GetMoodStatsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMoodStatsRef:
```typescript
const name = getMoodStatsRef.operationName;
console.log(name);
```

### Variables
The `GetMoodStats` query has no variables.
### Return Type
Recall that executing the `GetMoodStats` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMoodStatsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMoodStats`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMoodStats } from '@dataconnect/generated';


// Call the `getMoodStats()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMoodStats();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMoodStats(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMoodStats().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMoodStats`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMoodStatsRef } from '@dataconnect/generated';


// Call the `getMoodStatsRef()` function to get a reference to the query.
const ref = getMoodStatsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMoodStatsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListJournalEntries
You can execute the `ListJournalEntries` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listJournalEntries(options?: ExecuteQueryOptions): QueryPromise<ListJournalEntriesData, undefined>;

interface ListJournalEntriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJournalEntriesData, undefined>;
}
export const listJournalEntriesRef: ListJournalEntriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listJournalEntries(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJournalEntriesData, undefined>;

interface ListJournalEntriesRef {
  ...
  (dc: DataConnect): QueryRef<ListJournalEntriesData, undefined>;
}
export const listJournalEntriesRef: ListJournalEntriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listJournalEntriesRef:
```typescript
const name = listJournalEntriesRef.operationName;
console.log(name);
```

### Variables
The `ListJournalEntries` query has no variables.
### Return Type
Recall that executing the `ListJournalEntries` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListJournalEntriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListJournalEntries`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listJournalEntries } from '@dataconnect/generated';


// Call the `listJournalEntries()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listJournalEntries();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listJournalEntries(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
listJournalEntries().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `ListJournalEntries`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listJournalEntriesRef } from '@dataconnect/generated';


// Call the `listJournalEntriesRef()` function to get a reference to the query.
const ref = listJournalEntriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listJournalEntriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetJournalEntry
You can execute the `GetJournalEntry` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getJournalEntry(vars: GetJournalEntryVariables, options?: ExecuteQueryOptions): QueryPromise<GetJournalEntryData, GetJournalEntryVariables>;

interface GetJournalEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJournalEntryVariables): QueryRef<GetJournalEntryData, GetJournalEntryVariables>;
}
export const getJournalEntryRef: GetJournalEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getJournalEntry(dc: DataConnect, vars: GetJournalEntryVariables, options?: ExecuteQueryOptions): QueryPromise<GetJournalEntryData, GetJournalEntryVariables>;

interface GetJournalEntryRef {
  ...
  (dc: DataConnect, vars: GetJournalEntryVariables): QueryRef<GetJournalEntryData, GetJournalEntryVariables>;
}
export const getJournalEntryRef: GetJournalEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getJournalEntryRef:
```typescript
const name = getJournalEntryRef.operationName;
console.log(name);
```

### Variables
The `GetJournalEntry` query requires an argument of type `GetJournalEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetJournalEntryVariables {
  entryId: UUIDString;
}
```
### Return Type
Recall that executing the `GetJournalEntry` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetJournalEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetJournalEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getJournalEntry, GetJournalEntryVariables } from '@dataconnect/generated';

// The `GetJournalEntry` query requires an argument of type `GetJournalEntryVariables`:
const getJournalEntryVars: GetJournalEntryVariables = {
  entryId: ..., 
};

// Call the `getJournalEntry()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getJournalEntry(getJournalEntryVars);
// Variables can be defined inline as well.
const { data } = await getJournalEntry({ entryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getJournalEntry(dataConnect, getJournalEntryVars);

console.log(data.journalEntry);

// Or, you can use the `Promise` API.
getJournalEntry(getJournalEntryVars).then((response) => {
  const data = response.data;
  console.log(data.journalEntry);
});
```

### Using `GetJournalEntry`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getJournalEntryRef, GetJournalEntryVariables } from '@dataconnect/generated';

// The `GetJournalEntry` query requires an argument of type `GetJournalEntryVariables`:
const getJournalEntryVars: GetJournalEntryVariables = {
  entryId: ..., 
};

// Call the `getJournalEntryRef()` function to get a reference to the query.
const ref = getJournalEntryRef(getJournalEntryVars);
// Variables can be defined inline as well.
const ref = getJournalEntryRef({ entryId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getJournalEntryRef(dataConnect, getJournalEntryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.journalEntry);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.journalEntry);
});
```

## ListActivities
You can execute the `ListActivities` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listActivities(options?: ExecuteQueryOptions): QueryPromise<ListActivitiesData, undefined>;

interface ListActivitiesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListActivitiesData, undefined>;
}
export const listActivitiesRef: ListActivitiesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listActivities(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListActivitiesData, undefined>;

interface ListActivitiesRef {
  ...
  (dc: DataConnect): QueryRef<ListActivitiesData, undefined>;
}
export const listActivitiesRef: ListActivitiesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listActivitiesRef:
```typescript
const name = listActivitiesRef.operationName;
console.log(name);
```

### Variables
The `ListActivities` query has no variables.
### Return Type
Recall that executing the `ListActivities` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListActivitiesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListActivities`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listActivities } from '@dataconnect/generated';


// Call the `listActivities()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listActivities();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listActivities(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
listActivities().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `ListActivities`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listActivitiesRef } from '@dataconnect/generated';


// Call the `listActivitiesRef()` function to get a reference to the query.
const ref = listActivitiesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listActivitiesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListTherapySessions
You can execute the `ListTherapySessions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTherapySessions(options?: ExecuteQueryOptions): QueryPromise<ListTherapySessionsData, undefined>;

interface ListTherapySessionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTherapySessionsData, undefined>;
}
export const listTherapySessionsRef: ListTherapySessionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTherapySessions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTherapySessionsData, undefined>;

interface ListTherapySessionsRef {
  ...
  (dc: DataConnect): QueryRef<ListTherapySessionsData, undefined>;
}
export const listTherapySessionsRef: ListTherapySessionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTherapySessionsRef:
```typescript
const name = listTherapySessionsRef.operationName;
console.log(name);
```

### Variables
The `ListTherapySessions` query has no variables.
### Return Type
Recall that executing the `ListTherapySessions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTherapySessionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListTherapySessions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTherapySessions } from '@dataconnect/generated';


// Call the `listTherapySessions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTherapySessions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTherapySessions(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
listTherapySessions().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `ListTherapySessions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTherapySessionsRef } from '@dataconnect/generated';


// Call the `listTherapySessionsRef()` function to get a reference to the query.
const ref = listTherapySessionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTherapySessionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetLatestSafetyCheckIn
You can execute the `GetLatestSafetyCheckIn` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getLatestSafetyCheckIn(options?: ExecuteQueryOptions): QueryPromise<GetLatestSafetyCheckInData, undefined>;

interface GetLatestSafetyCheckInRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetLatestSafetyCheckInData, undefined>;
}
export const getLatestSafetyCheckInRef: GetLatestSafetyCheckInRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLatestSafetyCheckIn(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetLatestSafetyCheckInData, undefined>;

interface GetLatestSafetyCheckInRef {
  ...
  (dc: DataConnect): QueryRef<GetLatestSafetyCheckInData, undefined>;
}
export const getLatestSafetyCheckInRef: GetLatestSafetyCheckInRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLatestSafetyCheckInRef:
```typescript
const name = getLatestSafetyCheckInRef.operationName;
console.log(name);
```

### Variables
The `GetLatestSafetyCheckIn` query has no variables.
### Return Type
Recall that executing the `GetLatestSafetyCheckIn` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLatestSafetyCheckInData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetLatestSafetyCheckIn`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLatestSafetyCheckIn } from '@dataconnect/generated';


// Call the `getLatestSafetyCheckIn()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLatestSafetyCheckIn();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLatestSafetyCheckIn(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getLatestSafetyCheckIn().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetLatestSafetyCheckIn`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLatestSafetyCheckInRef } from '@dataconnect/generated';


// Call the `getLatestSafetyCheckInRef()` function to get a reference to the query.
const ref = getLatestSafetyCheckInRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLatestSafetyCheckInRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUserProfile
You can execute the `UpsertUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  (dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserProfileRef:
```typescript
const name = upsertUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserProfileVariables {
  email: string;
  displayName?: string | null;
  avatar?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserProfileData {
  user_upsert: User_Key;
}
```
### Using `UpsertUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfile, UpsertUserProfileVariables } from '@dataconnect/generated';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  email: ..., 
  displayName: ..., // optional
  avatar: ..., // optional
};

// Call the `upsertUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserProfile(upsertUserProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertUserProfile({ email: ..., displayName: ..., avatar: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserProfile(dataConnect, upsertUserProfileVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUserProfile(upsertUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfileRef, UpsertUserProfileVariables } from '@dataconnect/generated';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  email: ..., 
  displayName: ..., // optional
  avatar: ..., // optional
};

// Call the `upsertUserProfileRef()` function to get a reference to the mutation.
const ref = upsertUserProfileRef(upsertUserProfileVars);
// Variables can be defined inline as well.
const ref = upsertUserProfileRef({ email: ..., displayName: ..., avatar: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserProfileRef(dataConnect, upsertUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## LogMood
You can execute the `LogMood` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logMood(vars: LogMoodVariables): MutationPromise<LogMoodData, LogMoodVariables>;

interface LogMoodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogMoodVariables): MutationRef<LogMoodData, LogMoodVariables>;
}
export const logMoodRef: LogMoodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logMood(dc: DataConnect, vars: LogMoodVariables): MutationPromise<LogMoodData, LogMoodVariables>;

interface LogMoodRef {
  ...
  (dc: DataConnect, vars: LogMoodVariables): MutationRef<LogMoodData, LogMoodVariables>;
}
export const logMoodRef: LogMoodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logMoodRef:
```typescript
const name = logMoodRef.operationName;
console.log(name);
```

### Variables
The `LogMood` mutation requires an argument of type `LogMoodVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogMoodVariables {
  mood: string;
  intensity?: number | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `LogMood` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogMoodData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogMoodData {
  mood_insert: Mood_Key;
}
```
### Using `LogMood`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logMood, LogMoodVariables } from '@dataconnect/generated';

// The `LogMood` mutation requires an argument of type `LogMoodVariables`:
const logMoodVars: LogMoodVariables = {
  mood: ..., 
  intensity: ..., // optional
  notes: ..., // optional
};

// Call the `logMood()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logMood(logMoodVars);
// Variables can be defined inline as well.
const { data } = await logMood({ mood: ..., intensity: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logMood(dataConnect, logMoodVars);

console.log(data.mood_insert);

// Or, you can use the `Promise` API.
logMood(logMoodVars).then((response) => {
  const data = response.data;
  console.log(data.mood_insert);
});
```

### Using `LogMood`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logMoodRef, LogMoodVariables } from '@dataconnect/generated';

// The `LogMood` mutation requires an argument of type `LogMoodVariables`:
const logMoodVars: LogMoodVariables = {
  mood: ..., 
  intensity: ..., // optional
  notes: ..., // optional
};

// Call the `logMoodRef()` function to get a reference to the mutation.
const ref = logMoodRef(logMoodVars);
// Variables can be defined inline as well.
const ref = logMoodRef({ mood: ..., intensity: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logMoodRef(dataConnect, logMoodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.mood_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.mood_insert);
});
```

## ClearRecentUserMoods
You can execute the `ClearRecentUserMoods` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
clearRecentUserMoods(vars: ClearRecentUserMoodsVariables): MutationPromise<ClearRecentUserMoodsData, ClearRecentUserMoodsVariables>;

interface ClearRecentUserMoodsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ClearRecentUserMoodsVariables): MutationRef<ClearRecentUserMoodsData, ClearRecentUserMoodsVariables>;
}
export const clearRecentUserMoodsRef: ClearRecentUserMoodsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
clearRecentUserMoods(dc: DataConnect, vars: ClearRecentUserMoodsVariables): MutationPromise<ClearRecentUserMoodsData, ClearRecentUserMoodsVariables>;

interface ClearRecentUserMoodsRef {
  ...
  (dc: DataConnect, vars: ClearRecentUserMoodsVariables): MutationRef<ClearRecentUserMoodsData, ClearRecentUserMoodsVariables>;
}
export const clearRecentUserMoodsRef: ClearRecentUserMoodsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the clearRecentUserMoodsRef:
```typescript
const name = clearRecentUserMoodsRef.operationName;
console.log(name);
```

### Variables
The `ClearRecentUserMoods` mutation requires an argument of type `ClearRecentUserMoodsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ClearRecentUserMoodsVariables {
  since: TimestampString;
}
```
### Return Type
Recall that executing the `ClearRecentUserMoods` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ClearRecentUserMoodsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ClearRecentUserMoodsData {
  mood_delete?: Mood_Key | null;
}
```
### Using `ClearRecentUserMoods`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, clearRecentUserMoods, ClearRecentUserMoodsVariables } from '@dataconnect/generated';

// The `ClearRecentUserMoods` mutation requires an argument of type `ClearRecentUserMoodsVariables`:
const clearRecentUserMoodsVars: ClearRecentUserMoodsVariables = {
  since: ..., 
};

// Call the `clearRecentUserMoods()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await clearRecentUserMoods(clearRecentUserMoodsVars);
// Variables can be defined inline as well.
const { data } = await clearRecentUserMoods({ since: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await clearRecentUserMoods(dataConnect, clearRecentUserMoodsVars);

console.log(data.mood_delete);

// Or, you can use the `Promise` API.
clearRecentUserMoods(clearRecentUserMoodsVars).then((response) => {
  const data = response.data;
  console.log(data.mood_delete);
});
```

### Using `ClearRecentUserMoods`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, clearRecentUserMoodsRef, ClearRecentUserMoodsVariables } from '@dataconnect/generated';

// The `ClearRecentUserMoods` mutation requires an argument of type `ClearRecentUserMoodsVariables`:
const clearRecentUserMoodsVars: ClearRecentUserMoodsVariables = {
  since: ..., 
};

// Call the `clearRecentUserMoodsRef()` function to get a reference to the mutation.
const ref = clearRecentUserMoodsRef(clearRecentUserMoodsVars);
// Variables can be defined inline as well.
const ref = clearRecentUserMoodsRef({ since: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = clearRecentUserMoodsRef(dataConnect, clearRecentUserMoodsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.mood_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.mood_delete);
});
```

## CreateJournalEntry
You can execute the `CreateJournalEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createJournalEntry(vars: CreateJournalEntryVariables): MutationPromise<CreateJournalEntryData, CreateJournalEntryVariables>;

interface CreateJournalEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJournalEntryVariables): MutationRef<CreateJournalEntryData, CreateJournalEntryVariables>;
}
export const createJournalEntryRef: CreateJournalEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createJournalEntry(dc: DataConnect, vars: CreateJournalEntryVariables): MutationPromise<CreateJournalEntryData, CreateJournalEntryVariables>;

interface CreateJournalEntryRef {
  ...
  (dc: DataConnect, vars: CreateJournalEntryVariables): MutationRef<CreateJournalEntryData, CreateJournalEntryVariables>;
}
export const createJournalEntryRef: CreateJournalEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createJournalEntryRef:
```typescript
const name = createJournalEntryRef.operationName;
console.log(name);
```

### Variables
The `CreateJournalEntry` mutation requires an argument of type `CreateJournalEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateJournalEntryVariables {
  title: string;
  content: string;
  tags?: string | null;
}
```
### Return Type
Recall that executing the `CreateJournalEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateJournalEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateJournalEntryData {
  journalEntry_insert: JournalEntry_Key;
}
```
### Using `CreateJournalEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createJournalEntry, CreateJournalEntryVariables } from '@dataconnect/generated';

// The `CreateJournalEntry` mutation requires an argument of type `CreateJournalEntryVariables`:
const createJournalEntryVars: CreateJournalEntryVariables = {
  title: ..., 
  content: ..., 
  tags: ..., // optional
};

// Call the `createJournalEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createJournalEntry(createJournalEntryVars);
// Variables can be defined inline as well.
const { data } = await createJournalEntry({ title: ..., content: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createJournalEntry(dataConnect, createJournalEntryVars);

console.log(data.journalEntry_insert);

// Or, you can use the `Promise` API.
createJournalEntry(createJournalEntryVars).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_insert);
});
```

### Using `CreateJournalEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createJournalEntryRef, CreateJournalEntryVariables } from '@dataconnect/generated';

// The `CreateJournalEntry` mutation requires an argument of type `CreateJournalEntryVariables`:
const createJournalEntryVars: CreateJournalEntryVariables = {
  title: ..., 
  content: ..., 
  tags: ..., // optional
};

// Call the `createJournalEntryRef()` function to get a reference to the mutation.
const ref = createJournalEntryRef(createJournalEntryVars);
// Variables can be defined inline as well.
const ref = createJournalEntryRef({ title: ..., content: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createJournalEntryRef(dataConnect, createJournalEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.journalEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_insert);
});
```

## UpdateJournalEntry
You can execute the `UpdateJournalEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateJournalEntry(vars: UpdateJournalEntryVariables): MutationPromise<UpdateJournalEntryData, UpdateJournalEntryVariables>;

interface UpdateJournalEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJournalEntryVariables): MutationRef<UpdateJournalEntryData, UpdateJournalEntryVariables>;
}
export const updateJournalEntryRef: UpdateJournalEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateJournalEntry(dc: DataConnect, vars: UpdateJournalEntryVariables): MutationPromise<UpdateJournalEntryData, UpdateJournalEntryVariables>;

interface UpdateJournalEntryRef {
  ...
  (dc: DataConnect, vars: UpdateJournalEntryVariables): MutationRef<UpdateJournalEntryData, UpdateJournalEntryVariables>;
}
export const updateJournalEntryRef: UpdateJournalEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateJournalEntryRef:
```typescript
const name = updateJournalEntryRef.operationName;
console.log(name);
```

### Variables
The `UpdateJournalEntry` mutation requires an argument of type `UpdateJournalEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateJournalEntryVariables {
  entryId: UUIDString;
  title?: string | null;
  content?: string | null;
  tags?: string | null;
}
```
### Return Type
Recall that executing the `UpdateJournalEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateJournalEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateJournalEntryData {
  journalEntry_update?: JournalEntry_Key | null;
}
```
### Using `UpdateJournalEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateJournalEntry, UpdateJournalEntryVariables } from '@dataconnect/generated';

// The `UpdateJournalEntry` mutation requires an argument of type `UpdateJournalEntryVariables`:
const updateJournalEntryVars: UpdateJournalEntryVariables = {
  entryId: ..., 
  title: ..., // optional
  content: ..., // optional
  tags: ..., // optional
};

// Call the `updateJournalEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateJournalEntry(updateJournalEntryVars);
// Variables can be defined inline as well.
const { data } = await updateJournalEntry({ entryId: ..., title: ..., content: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateJournalEntry(dataConnect, updateJournalEntryVars);

console.log(data.journalEntry_update);

// Or, you can use the `Promise` API.
updateJournalEntry(updateJournalEntryVars).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_update);
});
```

### Using `UpdateJournalEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateJournalEntryRef, UpdateJournalEntryVariables } from '@dataconnect/generated';

// The `UpdateJournalEntry` mutation requires an argument of type `UpdateJournalEntryVariables`:
const updateJournalEntryVars: UpdateJournalEntryVariables = {
  entryId: ..., 
  title: ..., // optional
  content: ..., // optional
  tags: ..., // optional
};

// Call the `updateJournalEntryRef()` function to get a reference to the mutation.
const ref = updateJournalEntryRef(updateJournalEntryVars);
// Variables can be defined inline as well.
const ref = updateJournalEntryRef({ entryId: ..., title: ..., content: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateJournalEntryRef(dataConnect, updateJournalEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.journalEntry_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_update);
});
```

## DeleteJournalEntry
You can execute the `DeleteJournalEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteJournalEntry(vars: DeleteJournalEntryVariables): MutationPromise<DeleteJournalEntryData, DeleteJournalEntryVariables>;

interface DeleteJournalEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJournalEntryVariables): MutationRef<DeleteJournalEntryData, DeleteJournalEntryVariables>;
}
export const deleteJournalEntryRef: DeleteJournalEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteJournalEntry(dc: DataConnect, vars: DeleteJournalEntryVariables): MutationPromise<DeleteJournalEntryData, DeleteJournalEntryVariables>;

interface DeleteJournalEntryRef {
  ...
  (dc: DataConnect, vars: DeleteJournalEntryVariables): MutationRef<DeleteJournalEntryData, DeleteJournalEntryVariables>;
}
export const deleteJournalEntryRef: DeleteJournalEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteJournalEntryRef:
```typescript
const name = deleteJournalEntryRef.operationName;
console.log(name);
```

### Variables
The `DeleteJournalEntry` mutation requires an argument of type `DeleteJournalEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteJournalEntryVariables {
  entryId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteJournalEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteJournalEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteJournalEntryData {
  journalEntry_delete?: JournalEntry_Key | null;
}
```
### Using `DeleteJournalEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteJournalEntry, DeleteJournalEntryVariables } from '@dataconnect/generated';

// The `DeleteJournalEntry` mutation requires an argument of type `DeleteJournalEntryVariables`:
const deleteJournalEntryVars: DeleteJournalEntryVariables = {
  entryId: ..., 
};

// Call the `deleteJournalEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteJournalEntry(deleteJournalEntryVars);
// Variables can be defined inline as well.
const { data } = await deleteJournalEntry({ entryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteJournalEntry(dataConnect, deleteJournalEntryVars);

console.log(data.journalEntry_delete);

// Or, you can use the `Promise` API.
deleteJournalEntry(deleteJournalEntryVars).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_delete);
});
```

### Using `DeleteJournalEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteJournalEntryRef, DeleteJournalEntryVariables } from '@dataconnect/generated';

// The `DeleteJournalEntry` mutation requires an argument of type `DeleteJournalEntryVariables`:
const deleteJournalEntryVars: DeleteJournalEntryVariables = {
  entryId: ..., 
};

// Call the `deleteJournalEntryRef()` function to get a reference to the mutation.
const ref = deleteJournalEntryRef(deleteJournalEntryVars);
// Variables can be defined inline as well.
const ref = deleteJournalEntryRef({ entryId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteJournalEntryRef(dataConnect, deleteJournalEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.journalEntry_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_delete);
});
```

## LogActivity
You can execute the `LogActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logActivity(vars: LogActivityVariables): MutationPromise<LogActivityData, LogActivityVariables>;

interface LogActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogActivityVariables): MutationRef<LogActivityData, LogActivityVariables>;
}
export const logActivityRef: LogActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logActivity(dc: DataConnect, vars: LogActivityVariables): MutationPromise<LogActivityData, LogActivityVariables>;

interface LogActivityRef {
  ...
  (dc: DataConnect, vars: LogActivityVariables): MutationRef<LogActivityData, LogActivityVariables>;
}
export const logActivityRef: LogActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logActivityRef:
```typescript
const name = logActivityRef.operationName;
console.log(name);
```

### Variables
The `LogActivity` mutation requires an argument of type `LogActivityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogActivityVariables {
  activityType: string;
  duration?: number | null;
  score?: number | null;
}
```
### Return Type
Recall that executing the `LogActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogActivityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogActivityData {
  activity_insert: Activity_Key;
}
```
### Using `LogActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logActivity, LogActivityVariables } from '@dataconnect/generated';

// The `LogActivity` mutation requires an argument of type `LogActivityVariables`:
const logActivityVars: LogActivityVariables = {
  activityType: ..., 
  duration: ..., // optional
  score: ..., // optional
};

// Call the `logActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logActivity(logActivityVars);
// Variables can be defined inline as well.
const { data } = await logActivity({ activityType: ..., duration: ..., score: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logActivity(dataConnect, logActivityVars);

console.log(data.activity_insert);

// Or, you can use the `Promise` API.
logActivity(logActivityVars).then((response) => {
  const data = response.data;
  console.log(data.activity_insert);
});
```

### Using `LogActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logActivityRef, LogActivityVariables } from '@dataconnect/generated';

// The `LogActivity` mutation requires an argument of type `LogActivityVariables`:
const logActivityVars: LogActivityVariables = {
  activityType: ..., 
  duration: ..., // optional
  score: ..., // optional
};

// Call the `logActivityRef()` function to get a reference to the mutation.
const ref = logActivityRef(logActivityVars);
// Variables can be defined inline as well.
const ref = logActivityRef({ activityType: ..., duration: ..., score: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logActivityRef(dataConnect, logActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activity_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activity_insert);
});
```

## UpsertTherapySession
You can execute the `UpsertTherapySession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertTherapySession(vars?: UpsertTherapySessionVariables): MutationPromise<UpsertTherapySessionData, UpsertTherapySessionVariables>;

interface UpsertTherapySessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertTherapySessionVariables): MutationRef<UpsertTherapySessionData, UpsertTherapySessionVariables>;
}
export const upsertTherapySessionRef: UpsertTherapySessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertTherapySession(dc: DataConnect, vars?: UpsertTherapySessionVariables): MutationPromise<UpsertTherapySessionData, UpsertTherapySessionVariables>;

interface UpsertTherapySessionRef {
  ...
  (dc: DataConnect, vars?: UpsertTherapySessionVariables): MutationRef<UpsertTherapySessionData, UpsertTherapySessionVariables>;
}
export const upsertTherapySessionRef: UpsertTherapySessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertTherapySessionRef:
```typescript
const name = upsertTherapySessionRef.operationName;
console.log(name);
```

### Variables
The `UpsertTherapySession` mutation has an optional argument of type `UpsertTherapySessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertTherapySessionVariables {
  sessionId?: UUIDString | null;
  therapist?: string | null;
  sessionDate?: TimestampString | null;
  duration?: number | null;
  notes?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpsertTherapySession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertTherapySessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertTherapySessionData {
  therapySession_upsert: TherapySession_Key;
}
```
### Using `UpsertTherapySession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertTherapySession, UpsertTherapySessionVariables } from '@dataconnect/generated';

// The `UpsertTherapySession` mutation has an optional argument of type `UpsertTherapySessionVariables`:
const upsertTherapySessionVars: UpsertTherapySessionVariables = {
  sessionId: ..., // optional
  therapist: ..., // optional
  sessionDate: ..., // optional
  duration: ..., // optional
  notes: ..., // optional
  status: ..., // optional
};

// Call the `upsertTherapySession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertTherapySession(upsertTherapySessionVars);
// Variables can be defined inline as well.
const { data } = await upsertTherapySession({ sessionId: ..., therapist: ..., sessionDate: ..., duration: ..., notes: ..., status: ..., });
// Since all variables are optional for this mutation, you can omit the `UpsertTherapySessionVariables` argument.
const { data } = await upsertTherapySession();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertTherapySession(dataConnect, upsertTherapySessionVars);

console.log(data.therapySession_upsert);

// Or, you can use the `Promise` API.
upsertTherapySession(upsertTherapySessionVars).then((response) => {
  const data = response.data;
  console.log(data.therapySession_upsert);
});
```

### Using `UpsertTherapySession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertTherapySessionRef, UpsertTherapySessionVariables } from '@dataconnect/generated';

// The `UpsertTherapySession` mutation has an optional argument of type `UpsertTherapySessionVariables`:
const upsertTherapySessionVars: UpsertTherapySessionVariables = {
  sessionId: ..., // optional
  therapist: ..., // optional
  sessionDate: ..., // optional
  duration: ..., // optional
  notes: ..., // optional
  status: ..., // optional
};

// Call the `upsertTherapySessionRef()` function to get a reference to the mutation.
const ref = upsertTherapySessionRef(upsertTherapySessionVars);
// Variables can be defined inline as well.
const ref = upsertTherapySessionRef({ sessionId: ..., therapist: ..., sessionDate: ..., duration: ..., notes: ..., status: ..., });
// Since all variables are optional for this mutation, you can omit the `UpsertTherapySessionVariables` argument.
const ref = upsertTherapySessionRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertTherapySessionRef(dataConnect, upsertTherapySessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.therapySession_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.therapySession_upsert);
});
```

## RecordSafetyCheckIn
You can execute the `RecordSafetyCheckIn` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
recordSafetyCheckIn(vars: RecordSafetyCheckInVariables): MutationPromise<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;

interface RecordSafetyCheckInRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordSafetyCheckInVariables): MutationRef<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;
}
export const recordSafetyCheckInRef: RecordSafetyCheckInRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordSafetyCheckIn(dc: DataConnect, vars: RecordSafetyCheckInVariables): MutationPromise<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;

interface RecordSafetyCheckInRef {
  ...
  (dc: DataConnect, vars: RecordSafetyCheckInVariables): MutationRef<RecordSafetyCheckInData, RecordSafetyCheckInVariables>;
}
export const recordSafetyCheckInRef: RecordSafetyCheckInRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordSafetyCheckInRef:
```typescript
const name = recordSafetyCheckInRef.operationName;
console.log(name);
```

### Variables
The `RecordSafetyCheckIn` mutation requires an argument of type `RecordSafetyCheckInVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordSafetyCheckInVariables {
  status: string;
  message?: string | null;
  reviewDate?: TimestampString | null;
}
```
### Return Type
Recall that executing the `RecordSafetyCheckIn` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordSafetyCheckInData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordSafetyCheckInData {
  safetyCheckIn_insert: SafetyCheckIn_Key;
}
```
### Using `RecordSafetyCheckIn`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordSafetyCheckIn, RecordSafetyCheckInVariables } from '@dataconnect/generated';

// The `RecordSafetyCheckIn` mutation requires an argument of type `RecordSafetyCheckInVariables`:
const recordSafetyCheckInVars: RecordSafetyCheckInVariables = {
  status: ..., 
  message: ..., // optional
  reviewDate: ..., // optional
};

// Call the `recordSafetyCheckIn()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordSafetyCheckIn(recordSafetyCheckInVars);
// Variables can be defined inline as well.
const { data } = await recordSafetyCheckIn({ status: ..., message: ..., reviewDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordSafetyCheckIn(dataConnect, recordSafetyCheckInVars);

console.log(data.safetyCheckIn_insert);

// Or, you can use the `Promise` API.
recordSafetyCheckIn(recordSafetyCheckInVars).then((response) => {
  const data = response.data;
  console.log(data.safetyCheckIn_insert);
});
```

### Using `RecordSafetyCheckIn`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordSafetyCheckInRef, RecordSafetyCheckInVariables } from '@dataconnect/generated';

// The `RecordSafetyCheckIn` mutation requires an argument of type `RecordSafetyCheckInVariables`:
const recordSafetyCheckInVars: RecordSafetyCheckInVariables = {
  status: ..., 
  message: ..., // optional
  reviewDate: ..., // optional
};

// Call the `recordSafetyCheckInRef()` function to get a reference to the mutation.
const ref = recordSafetyCheckInRef(recordSafetyCheckInVars);
// Variables can be defined inline as well.
const ref = recordSafetyCheckInRef({ status: ..., message: ..., reviewDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordSafetyCheckInRef(dataConnect, recordSafetyCheckInVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.safetyCheckIn_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.safetyCheckIn_insert);
});
```

