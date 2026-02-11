/**
 * PHASE 3C - INTEGRATION & TESTING GUIDE
 * 
 * Complete guide for testing the Audit Log Management UI
 * with backend integration
 * 
 * Date: January 12, 2026
 * Status: Ready for Testing
 */

# Phase 3c Integration & Testing Guide

## Prerequisites

Before starting Phase 3c testing, ensure:

1. ✅ **Phase 1-3a Complete** - All components and services created
2. ✅ **Backend API Running** - Audit log endpoints available
3. ✅ **Database Seeded** - Test data in database
4. ✅ **Auth Working** - JWT tokens being issued correctly
5. ✅ **Compilation Success** - `ng build` passes without errors

## Test Environment Setup

### Start Development Server

```bash
# Terminal 1: Start Angular dev server
npm start
# or
ng serve

# Opens at: http://localhost:4200
```

### Check Backend Endpoints

```bash
# Terminal 2: Verify API is running
curl -X GET http://localhost:3000/api/audit-logs \
  -H "Authorization: Bearer <your-jwt-token>"

# Expected response: 200 with PagedResult<IMedicalRecordAccessLog>
```

### Login as Test User

1. Navigate to http://localhost:4200/login
2. Use test credentials:
   - **SuperAdmin:** admin@example.com / password
   - **ClinicAdmin:** clinic@example.com / password
   - **Doctor:** doctor@example.com / password

3. Verify token stored in localStorage:
   ```javascript
   // In Chrome DevTools Console:
   localStorage.getItem('ngrx_auth') // Should have JWT token
   ```

---

## Testing Sections

### 1. API Integration Testing

#### Test 1.1: GET /api/audit-logs Basic Request

```bash
# Without filters
curl -X GET http://localhost:3000/api/audit-logs \
  -H "Authorization: Bearer <token>" \
  -H "X-User-Role: SuperAdmin" \
  -H "X-Clinic-Id: 1"

# Expected: 200 with logs array
```

#### Test 1.2: Pagination Parameters

```bash
# With pagination
curl -X GET "http://localhost:3000/api/audit-logs?page=1&pageSize=10" \
  -H "Authorization: Bearer <token>"

# Expected: 200 with 10 items max
# Check response: { data: [...], pagination: { total: X, page: 1, pageSize: 10 } }
```

#### Test 1.3: Filter Parameters

```bash
# With date filter
curl -X GET "http://localhost:3000/api/audit-logs?dateFrom=2026-01-01&dateTo=2026-01-12" \
  -H "Authorization: Bearer <token>"

# Expected: 200 with filtered logs
```

#### Test 1.4: Authorization Headers

In Chrome DevTools Network tab:
1. Navigate to http://localhost:4200/audit-logs
2. Check network requests
3. Verify headers:
   - ✅ `Authorization: Bearer <token>`
   - ✅ `X-User-Role: SuperAdmin` (or your role)
   - ✅ `X-Clinic-Id: 1` (if applicable)
   - ✅ `X-Account-Id: 1` (if applicable)

### 2. Component Integration Testing

#### Test 2.1: Filter Form Submission

```javascript
// In browser console, after navigating to /audit-logs:

// Check if filter component is present
document.querySelector('app-audit-log-filters')

// Manually submit filter (or use UI)
// 1. Fill date range: 2026-01-01 to 2026-01-12
// 2. Click Submit button
// 3. Check network tab for API call with correct parameters

// Expected: loadAuditLogs action dispatched
// Network: GET request with ?dateFrom=... params
```

#### Test 2.2: Table Pagination

```javascript
// In UI:
// 1. Navigate to /audit-logs
// 2. Wait for logs to load
// 3. Click page size dropdown (10, 25, 50)
// 4. Select 25 items per page
// 5. Verify table re-renders with 25 items
// 6. Click next page button
// 7. Verify new page loads

// Expected: pageChange event, new logs loaded
```

#### Test 2.3: Loading States

```javascript
// While loading:
// 1. Check if spinner visible
// 2. Check if form disabled
// 3. Check if table grayed out

// Expected: Visual feedback during load
```

### 3. Authorization Testing

#### Test 3.1: Unauthorized Access

```bash
# Try to access /audit-logs without permission
# As user with role: Patient

# Expected: 403 error
# App redirects to: /unauthorized
# Message displayed: "Access Denied"
```

#### Test 3.2: Permission-Based Features

```javascript
// As SuperAdmin:
// ✅ Can view /audit-logs
// ✅ Can export logs
// ✅ Can generate report

// As Doctor:
// ✅ Can view /audit-logs
// ❌ Cannot export logs (disabled button or 403)
// ❌ Cannot generate report (disabled button or 403)

// As Patient:
// ❌ Cannot access /audit-logs (redirected to /unauthorized)
```

#### Test 3.3: Token Expiry

```javascript
// Simulate expired token:
// 1. Open DevTools
// 2. Clear localStorage
// 3. localStorage.setItem('ngrx_auth', JSON.stringify({token: 'invalid'}))
// 4. Refresh page or navigate
// 5. Expected: Redirected to /login
```

### 4. Error Handling Testing

#### Test 4.1: 404 Not Found

```bash
# Request non-existent log
curl -X GET http://localhost:3000/api/audit-logs/99999 \
  -H "Authorization: Bearer <token>"

# Expected: 404 error
# App should: Show error message, allow retry
```

#### Test 4.2: 500 Server Error

```bash
# Simulate server error (if possible with test data)
# Expected: Error message displayed, not a white page
```

#### Test 4.3: Network Timeout

```javascript
// Simulate slow network:
// 1. Chrome DevTools > Network tab
// 2. Set throttling to "Slow 3G"
// 3. Submit filter
// 4. Verify:
//    - Spinner shows
//    - Form disabled
//    - Doesn't timeout < 30 seconds
//    - Can cancel request
```

### 5. Performance Testing

#### Test 5.1: Large Dataset

```javascript
// Request many logs (if backend supports):
// 1. Filter to return 1000+ logs
// 2. Verify pagination works (10 items per page)
// 3. Measure:
//    - Page load time < 1 second
//    - Page change time < 500ms
//    - No memory leaks
```

#### Test 5.2: Memory Leaks

```javascript
// Chrome DevTools > Performance:
// 1. Take heap snapshot
// 2. Navigate to /audit-logs
// 3. Wait for load
// 4. Take heap snapshot #2
// 5. Compare sizes
// 6. Memory should not grow significantly

// Repeat navigation:
// 1. Go to /audit-logs
// 2. Navigate away
// 3. Go back to /audit-logs
// 4. Check subscriptions in memory
// 5. Should be no duplicates
```

### 6. Accessibility Testing

#### Test 6.1: Keyboard Navigation

```javascript
// Test keyboard:
// 1. Press Tab repeatedly
// 2. All form inputs should be focusable
// 3. Submit button should be reachable
// 4. Table rows should be selectable (if implemented)
// 5. Navigation links should work

// Expected: Logical tab order
```

#### Test 6.2: Screen Reader

```javascript
// Windows: Narrator
// Mac: VoiceOver
// Linux: GNOME Screen Reader

// Test:
// 1. Form labels announced correctly
// 2. Table headers announced
// 3. Error messages announced
// 4. Button purposes clear
```

#### Test 6.3: Color Contrast

```javascript
// Chrome DevTools > Accessibility:
// 1. Inspect form labels
// 2. Inspect table
// 3. Inspect error messages
// 4. Verify contrast ratio >= 4.5:1 for text

// Online tool: https://webaim.org/resources/contrastchecker/
```

### 7. Cross-Browser Testing

#### Test 7.1: Chrome

```bash
# In Chrome:
npm start
# Navigate to http://localhost:4200/audit-logs

# Test:
# ✅ Form submission
# ✅ Pagination
# ✅ Filter application
# ✅ Export (if available)
# ✅ Styling correct
# ✅ Responsive (resize window)
```

#### Test 7.2: Firefox

```bash
# Same tests as Chrome
# Check for Firefox-specific issues
# Example: Different date picker behavior
```

#### Test 7.3: Safari (if on Mac)

```bash
# Same tests as Chrome
# Check for Safari-specific issues
# Example: CSS Grid rendering
```

### 8. End-to-End Workflow

#### Complete Audit Log Access Workflow

```javascript
// Step 1: User logs in
// 1. Navigate to http://localhost:4200/login
// 2. Enter credentials (e.g., admin@example.com)
// 3. Click Login
// 4. Redirected to /
// 5. Check localStorage for JWT token

// Step 2: Navigate to Audit Logs
// 1. Click "Audit Logs" in navigation menu
// 2. Or navigate directly to http://localhost:4200/audit-logs
// 3. Page loads with initial logs
// 4. AuditAccessGuard allows access
// Expected: Logs displayed in table

// Step 3: Apply Filters
// 1. Set date range: 2026-01-01 to 2026-01-12
// 2. Select clinic from dropdown
// 3. Click "Apply Filters"
// 4. Wait for API call (check Network tab)
// 5. Verify filtered logs displayed
// Expected: Only logs matching filter shown

// Step 4: Paginate Results
// 1. Note current page (page 1, 10 items)
// 2. Change page size to 25
// 3. Table updates with 25 items
// 4. Click "Next" button
// 5. Wait for API call
// 6. New page of logs displayed
// Expected: Page number updated, new logs shown

// Step 5: Export Logs
// 1. Click "Export" button
// 2. API called: GET /api/audit-logs/export
// 3. Wait for download
// 4. CSV file downloaded to Downloads folder
// 5. Open CSV in Excel/Numbers
// Expected: Logs in CSV format, all columns present

// Step 6: Session Expires
// 1. Wait > token expiry (or simulate in DevTools)
// 2. Try to navigate or submit filter
// 3. Expected: 401 error → redirect to /login
// 4. No error in console

// Step 7: Insufficient Permissions
// 1. Logout
// 2. Login as user without VIEW_AUDIT_LOGS permission
// 3. Try to access /audit-logs
// 4. Expected: 403 error → redirect to /unauthorized
// 5. "Access Denied" message displayed
```

---

## Testing Checklist

### Phase 3c Completion Criteria

- [ ] **API Integration**
  - [ ] All 4 endpoints (GET list, GET detail, generate report, export) working
  - [ ] Pagination working with correct parameters
  - [ ] Filtering working for all filter types
  - [ ] Error responses handled correctly
  
- [ ] **Component Integration**
  - [ ] Filters component working
  - [ ] Table component rendering correctly
  - [ ] Pagination component working
  - [ ] Container component orchestrating correctly
  
- [ ] **Authorization**
  - [ ] AuditAccessGuard preventing unauthorized access
  - [ ] 403 errors redirecting to /unauthorized
  - [ ] 401 errors redirecting to /login
  - [ ] Permission headers sent correctly
  
- [ ] **Performance**
  - [ ] No memory leaks detected
  - [ ] Page load < 1 second
  - [ ] Pagination change < 500ms
  - [ ] No unnecessary re-renders
  
- [ ] **Accessibility**
  - [ ] Keyboard navigation working
  - [ ] Color contrast sufficient
  - [ ] Form labels accessible
  - [ ] Screen reader friendly
  
- [ ] **Cross-Browser**
  - [ ] Chrome: All features working
  - [ ] Firefox: All features working
  - [ ] Safari: All features working
  - [ ] Edge: All features working

---

## Known Issues & Troubleshooting

### Issue: 403 Forbidden on Audit Logs

**Cause:** User role doesn't have VIEW_AUDIT_LOGS permission

**Solution:**
```javascript
// Check user permissions in console:
localStorage.getItem('ngrx_auth')
// Parse JSON and check 'permissions' array
```

### Issue: Page Not Loading (Spinner Forever)

**Cause:** Backend API not responding

**Solution:**
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check browser console for network errors
3. Check backend logs for errors

### Issue: Form Doesn't Submit

**Cause:** Form validation failing

**Solution:**
```javascript
// In console:
document.querySelector('form')?.checkValidity() // should be true
```

### Issue: Pagination Not Changing Page

**Cause:** Page change event not being handled

**Solution:**
1. Check Network tab for API call
2. Verify `pageChange` event in component
3. Check store action dispatching

---

## Sign-Off Criteria

Phase 3c is complete when:

1. ✅ All manual tests passing
2. ✅ No console errors
3. ✅ Performance acceptable (< 1s load)
4. ✅ Accessibility verified
5. ✅ Works on Chrome, Firefox, Safari
6. ✅ Authorization working correctly
7. ✅ Error handling graceful

---

## Next Steps

After Phase 3c completion:

1. **Deployment Preparation**
   - Environment configuration
   - CI/CD pipeline setup
   - Monitoring setup

2. **Production Deployment**
   - Build production bundle: `ng build --prod`
   - Deploy to server
   - Verify endpoints
   - Monitor for errors

3. **Post-Launch**
   - Monitor error rates
   - Collect performance metrics
   - Gather user feedback
   - Plan Phase 3b (Consent Management) if needed
