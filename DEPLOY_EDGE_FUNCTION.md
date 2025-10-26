# 🚀 Deploy Edge Function for Multilingual Support

## Issue

The AI is responding only in English because the updated Edge Function with language support hasn't been deployed to Supabase yet.

## Solution

Deploy the updated `legal-chat` Edge Function to Supabase.

---

## 📋 Deployment Steps

### Option 1: Using Supabase CLI (Recommended)

```bash
# 1. Navigate to project directory
cd Tyson

# 2. Login to Supabase (if not already logged in)
supabase login

# 3. Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# 4. Deploy the Edge Function
supabase functions deploy legal-chat

# 5. Verify deployment
supabase functions list
```

### Option 2: Manual Deployment via Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar
4. Click on **legal-chat** function (or create new if doesn't exist)
5. Copy the entire content from `supabase/functions/legal-chat/index.ts`
6. Paste into the editor
7. Click **Deploy**
8. Wait for deployment to complete (~30 seconds)

---

## ✅ Verification

After deployment, test the multilingual feature:

1. Open the app: http://localhost:8081
2. Click the language selector in the header
3. Select Telugu (తెలుగు)
4. Go to Chat page
5. Type a question in English: "How do I file an FIR?"
6. **Expected**: AI responds in Telugu script
7. Repeat for Tamil, Hindi, Malayalam

---

## 🔍 Troubleshooting

### If AI still responds in English:

**Check 1: Verify deployment**

```bash
supabase functions list
# Should show legal-chat with recent deployment time
```

**Check 2: Check Edge Function logs**

```bash
supabase functions logs legal-chat
# Should show: "Processing legal query with X messages in language: te"
```

**Check 3: Verify language is being sent**

- Open browser DevTools (F12)
- Go to Network tab
- Send a message in chat
- Find the `legal-chat` request
- Check Request Payload - should include `"language": "te"` (or ta/hi/ml)

**Check 4: Verify GEMINI_API_KEY is set**

```bash
supabase secrets list
# Should show GEMINI_API_KEY
```

---

## 🛠️ Quick Fix Commands

```bash
# Full deployment sequence
cd Tyson
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy legal-chat
supabase functions logs legal-chat --follow
```

---

## 📝 What the Updated Edge Function Does

1. **Accepts language parameter** from frontend
2. **Validates language** (en, te, ta, hi, ml)
3. **Adds language-specific instruction** to system prompt
4. **Tells Gemini API** to respond in the selected language
5. **Returns response** in the requested language

### Example Language Instructions:

- **Telugu**: "Respond in Telugu (తెలుగు). Use Telugu script for your entire response."
- **Tamil**: "Respond in Tamil (தமிழ்). Use Tamil script for your entire response."
- **Hindi**: "Respond in Hindi (हिन्दी). Use Devanagari script for your entire response."
- **Malayalam**: "Respond in Malayalam (മലയാളം). Use Malayalam script for your entire response."

---

## ⚡ Expected Behavior After Deployment

### Before Deployment:

- User selects Telugu
- UI changes to Telugu ✅
- User types in English
- AI responds in English ❌

### After Deployment:

- User selects Telugu
- UI changes to Telugu ✅
- User types in English
- **AI responds in Telugu** ✅

---

## 🎯 Deployment Time

- **CLI Method**: ~2 minutes
- **Dashboard Method**: ~3 minutes
- **Verification**: ~1 minute
- **Total**: ~5 minutes

---

## ✅ Post-Deployment Checklist

- [ ] Edge Function deployed successfully
- [ ] Test Telugu responses
- [ ] Test Tamil responses
- [ ] Test Hindi responses
- [ ] Test Malayalam responses
- [ ] Test English responses
- [ ] Verify language switching mid-conversation
- [ ] Check Edge Function logs for errors

---

**Status**: Edge Function code is ready, just needs deployment to Supabase! 🚀
