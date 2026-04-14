# User/me Endpoint Implementation

## Overview
The `User/me` endpoint has been implemented to fetch the current authenticated user's profile data, including their medical specialty. This ensures proper initialization of the user's specialty in the NgRx store and correct template loading in medical history forms.

## Changes Made

### 1. AuthService (`src/app/services/auth.service.ts`)
- Added `getCurrentUser()` method that calls `GET /api/User/me`
- This method is called after successful login to fetch profile data

```typescript
getCurrentUser(): Observable<any> {
  return this.apiService.get(this.currentUserEndpoint);
}
```

### 2. Auth Actions (`src/app/store/actions/auth.actions.ts`)
Added three new actions:
- `loadUserProfile`: Triggered after loginSuccess to fetch user data
- `loadUserProfileSuccess`: Dispatched when User/me endpoint returns data
- `loadUserProfileFailure`: Dispatched if User/me endpoint fails

### 3. Auth Effects (`src/app/store/effects/auth.effects.ts`)
Implemented two new effects:

**loginSuccessLoadProfile$**
- Triggered on loginSuccess
- Automatically dispatches loadUserProfile action
- Creates seamless flow: Login → Fetch Profile → Update Store

**loadUserProfile$**
- Handles loadUserProfile action
- Calls AuthService.getCurrentUser()
- Dispatches loadUserProfileSuccess with specialty from response
- Falls back to 'General' on failure

**loadUserProfileSuccess$**
- Updates user state with specialty
- Navigates to /home after profile is loaded

### 4. Auth Reducer (`src/app/store/reducers/auth.reducer.ts`)
Added handlers for new profile loading actions:
- `loadUserProfileSuccess`: Updates specialty in AuthState
- `loadUserProfileFailure`: Sets specialty to 'General' as fallback

### 5. Patient Detail Component (`src/app/components/patients/patient-detail/patient-detail.component.ts`)
- Removed `take(1)` operator from userSpecialty subscription
- Now subscribes continuously to store updates
- Ensures specialty is available once User/me completes
- Properly initializes HistoryFormComponent with correct specialty

## Data Flow

```
1. User logs in (email/password)
   ↓
2. LoginEffect calls AuthService.login()
   ↓
3. Dispatches loginSuccess (with userId, token, clinicId)
   ↓
4. loginSuccessLoadProfile$ effect dispatches loadUserProfile
   ↓
5. loadUserProfile$ effect calls getCurrentUser() → /api/User/me
   ↓
6. Response received with specialty and other profile data
   ↓
7. Dispatches loadUserProfileSuccess with specialty
   ↓
8. Reducer updates AuthState.specialty
   ↓
9. PatientDetailComponent subscribers receive updated specialty
   ↓
10. Navigate to /home - App is fully initialized
```

## API Response Structure

The `User/me` endpoint should return:
```json
{
  "id": 123,
  "email": "doctor@example.com",
  "name": "Dr. Smith",
  "specialty": "Nutrición",
  "licenseNumber": "LIC123",
  "clinicId": 456
}
```

## Benefits

1. **Single Source of Truth**: User specialty is loaded from backend and stored in NgRx
2. **Proper Initialization**: Specialty is available before any component tries to use it
3. **Reliability**: No more race conditions with take(1) on uninitialized store values
4. **Consistency**: All medical history forms use the same specialty from User/me
5. **Error Handling**: Fallback to 'General' specialty if endpoint fails

## Testing Scenarios

1. **Login Flow**:
   - User logs in
   - User/me is called automatically
   - Specialty appears in store
   - PatientDetailComponent receives correct specialty

2. **Specialty-Specific Templates**:
   - User specialty is "Nutrición"
   - Open new consultation in PatientDetail
   - Nutrition template loads automatically

3. **Fallback Behavior**:
   - If User/me fails, specialty defaults to "General"
   - App continues to function

## Configuration Required

Ensure the backend endpoint is accessible:
- **Endpoint**: `GET /api/User/me`
- **Authentication**: Uses AuthInterceptor to inject token
- **Response**: Includes `specialty` field

## Future Enhancements

1. Cache User/me response to avoid re-fetching on navigation
2. Add user profile page to update specialty if changed
3. Implement refresh token logic alongside User/me call
4. Add additional user metadata (name, clinic list, etc.)
