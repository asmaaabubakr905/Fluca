# Test Passenger Flow - Debug Guide

## Steps to Test

### 1. Clear localStorage
```javascript
// Open browser console and run:
localStorage.clear();
```

### 2. Register as Passenger
1. Go to `/signup`
2. Fill in details
3. Select "Passenger" role
4. Submit
5. Check console for logs

### 3. Test Navigation Flow
1. Should redirect to `/passenger` (Homepage)
2. Click "Set Sail" → should go to `/passenger/language`
3. Select language → should go to `/passenger/ride-type`
4. Select "Private Charter" → should go to `/passenger/private-booking`
5. Click "Find Captains" → should go to `/passenger/offers`
6. Click "Accept Offer" → should go to `/passenger/tracking`

### 4. Check Console Logs
Look for these messages:
- "Creating user: {user object}"
- "Current user set in localStorage: {user object}"
- "Redirecting to passenger homepage"
- "RequirePassenger - Current user: {user object}"
- "Accept Offer clicked - navigating to tracking"

### 5. Debug localStorage
```javascript
// Check if user is stored correctly:
console.log('currentUser:', JSON.parse(localStorage.getItem('currentUser')));
console.log('users:', JSON.parse(localStorage.getItem('users')));
```

## Common Issues

### Issue: Redirecting to login
**Cause:** User not logged in or role not set correctly
**Solution:** 
1. Check localStorage for 'currentUser'
2. Verify user.role === 'Passenger'
3. Re-register if needed

### Issue: Navigation not working
**Cause:** Route protection failing
**Solution:**
1. Check console for "RequirePassenger" logs
2. Verify user object structure
3. Clear localStorage and try again

### Issue: Buttons not responding
**Cause:** Event handlers not working
**Solution:**
1. Check console for click logs
2. Verify navigate function is called
3. Check for JavaScript errors

## Expected Flow
1. SignUp (Passenger) → `/passenger`
2. Homepage → "Set Sail" → `/passenger/language`
3. Language → select → `/passenger/ride-type`
4. RideType → "Private Charter" → `/passenger/private-booking`
5. PrivateBooking → "Find Captains" → `/passenger/offers`
6. Offers → "Accept Offer" → `/passenger/tracking`
7. Tracking → "Complete Voyage" → `/passenger/rating`
8. Rating → "Submit Rating" → `/passenger`

## Debug Commands
```javascript
// Check current state
console.log('Current user:', JSON.parse(localStorage.getItem('currentUser')));
console.log('All users:', JSON.parse(localStorage.getItem('users')));

// Clear and restart
localStorage.clear();
location.reload();
``` 