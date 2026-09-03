# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertUserProfile, useLogMood, useClearRecentUserMoods, useCreateJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry, useLogActivity, useUpsertTherapySession, useRecordSafetyCheckIn, useGetUserProfile } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertUserProfile(upsertUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useLogMood(logMoodVars);

const { data, isPending, isSuccess, isError, error } = useClearRecentUserMoods(clearRecentUserMoodsVars);

const { data, isPending, isSuccess, isError, error } = useCreateJournalEntry(createJournalEntryVars);

const { data, isPending, isSuccess, isError, error } = useUpdateJournalEntry(updateJournalEntryVars);

const { data, isPending, isSuccess, isError, error } = useDeleteJournalEntry(deleteJournalEntryVars);

const { data, isPending, isSuccess, isError, error } = useLogActivity(logActivityVars);

const { data, isPending, isSuccess, isError, error } = useUpsertTherapySession(upsertTherapySessionVars);

const { data, isPending, isSuccess, isError, error } = useRecordSafetyCheckIn(recordSafetyCheckInVars);

const { data, isPending, isSuccess, isError, error } = useGetUserProfile();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUserProfile, logMood, clearRecentUserMoods, createJournalEntry, updateJournalEntry, deleteJournalEntry, logActivity, upsertTherapySession, recordSafetyCheckIn, getUserProfile } from '@dataconnect/generated';


// Operation UpsertUserProfile:  For variables, look at type UpsertUserProfileVars in ../index.d.ts
const { data } = await UpsertUserProfile(dataConnect, upsertUserProfileVars);

// Operation LogMood:  For variables, look at type LogMoodVars in ../index.d.ts
const { data } = await LogMood(dataConnect, logMoodVars);

// Operation ClearRecentUserMoods:  For variables, look at type ClearRecentUserMoodsVars in ../index.d.ts
const { data } = await ClearRecentUserMoods(dataConnect, clearRecentUserMoodsVars);

// Operation CreateJournalEntry:  For variables, look at type CreateJournalEntryVars in ../index.d.ts
const { data } = await CreateJournalEntry(dataConnect, createJournalEntryVars);

// Operation UpdateJournalEntry:  For variables, look at type UpdateJournalEntryVars in ../index.d.ts
const { data } = await UpdateJournalEntry(dataConnect, updateJournalEntryVars);

// Operation DeleteJournalEntry:  For variables, look at type DeleteJournalEntryVars in ../index.d.ts
const { data } = await DeleteJournalEntry(dataConnect, deleteJournalEntryVars);

// Operation LogActivity:  For variables, look at type LogActivityVars in ../index.d.ts
const { data } = await LogActivity(dataConnect, logActivityVars);

// Operation UpsertTherapySession:  For variables, look at type UpsertTherapySessionVars in ../index.d.ts
const { data } = await UpsertTherapySession(dataConnect, upsertTherapySessionVars);

// Operation RecordSafetyCheckIn:  For variables, look at type RecordSafetyCheckInVars in ../index.d.ts
const { data } = await RecordSafetyCheckIn(dataConnect, recordSafetyCheckInVars);

// Operation GetUserProfile: 
const { data } = await GetUserProfile(dataConnect);


```