# Troubleshooting Guide

## "Failed to start conversation. Please refresh." Error

This error occurs when the Chat feature cannot create a new conversation in the database. Here are the common causes and solutions:

### 1. ✅ Check if you're signed in

**Problem**: You must be authenticated to use the chat feature.

**Solution**:

1. Navigate to `/auth` in your browser
2. Sign up for a new account or sign in with existing credentials
3. Return to `/chat` after successful authentication

### 2. ✅ Verify Supabase is running (Local Development)

**Problem**: Local Supabase instance is not running.

**Solution**:

```bash
# Start Supabase locally
cd Tyson
npx supabase start

# Check status
npx supabase status
```

### 3. ✅ Apply Database Migrations

**Problem**: Database tables don't exist yet.

**Solution**:

```bash
# Apply migrations to local database
npx supabase db reset

# Or apply to remote database
npx supabase db push
```

### 4. ✅ Check Environment Variables

**Problem**: Supabase credentials are incorrect or missing.

**Solution**:

1. Check your `.env` file has correct values:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

2. For local development:

```bash
# Get local Supabase credentials
npx supabase status

# Copy the values to your .env file
```

3. Restart the dev server after changing `.env`:

```bash
npm run dev
```

### 5. ✅ Verify RLS Policies (Production)

**Problem**: Row Level Security policies are blocking inserts.

**Solution**:

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Policies
3. Verify the `conversations` table has these policies:
   - ✅ "Users can create their own conversations" (INSERT)
   - ✅ "Users can view their own conversations" (SELECT)

### 6. ✅ Check Browser Console

**Problem**: Need more details about the error.

**Solution**:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages starting with "Error creating conversation:"
4. Common error codes:
   - `42P01` - Table doesn't exist (run migrations)
   - `42501` - Permission denied (check RLS policies)
   - `JWT` errors - Authentication issue (sign in again)

### 7. ✅ Clear Browser Cache

**Problem**: Stale authentication tokens.

**Solution**:

1. Open DevTools (F12)
2. Go to Application → Storage
3. Clear all site data
4. Refresh and sign in again

---

## Quick Fix Checklist

Run through this checklist in order:

- [ ] 1. Are you signed in? (Go to `/auth`)
- [ ] 2. Is Supabase running? (`npx supabase status`)
- [ ] 3. Are migrations applied? (`npx supabase db reset`)
- [ ] 4. Are env vars correct? (Check `.env` file)
- [ ] 5. Did you restart dev server? (`npm run dev`)
- [ ] 6. Check browser console for specific errors

---

## Still Having Issues?

### For Local Development:

```bash
# Complete reset
npx supabase stop
npx supabase start
npx supabase db reset

# Verify everything is running
npx supabase status

# Restart your app
npm run dev
```

### For Production:

1. Check Supabase Dashboard → Database → Tables
   - Verify `conversations` table exists
   - Verify `messages` table exists
   - Verify `profiles` table exists

2. Check Supabase Dashboard → Authentication
   - Verify you have a user account
   - Try signing out and back in

3. Check Supabase Dashboard → Database → Policies
   - Verify RLS policies are enabled
   - Verify INSERT policy exists for conversations

---

## Error Messages Explained

| Error Message                  | Cause                    | Solution                             |
| ------------------------------ | ------------------------ | ------------------------------------ |
| "Database tables not found"    | Migrations not applied   | Run `npx supabase db reset`          |
| "Permission denied"            | RLS policy issue         | Check policies in Supabase Dashboard |
| "Authentication error"         | Invalid/expired token    | Sign out and sign in again           |
| "Please refresh and try again" | Network or unknown error | Check browser console for details    |

---

## Need More Help?

1. Check the browser console (F12) for detailed error messages
2. Check Supabase logs in the Dashboard
3. Verify your `.env` file matches your Supabase project
4. Make sure you're using the correct Supabase project (local vs production)
