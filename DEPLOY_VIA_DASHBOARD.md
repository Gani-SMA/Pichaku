# 🚀 Deploy Edge Function via Supabase Dashboard

## Quick Guide to Enable Multilingual AI Responses

Since Supabase CLI is not installed, follow these steps to deploy via the dashboard:

---

## 📋 Step-by-Step Instructions

### Step 1: Copy the Edge Function Code

The updated Edge Function is located at:

```
Tyson/supabase/functions/legal-chat/index.ts
```

Open this file and **copy all the content** (Ctrl+A, Ctrl+C)

---

### Step 2: Go to Supabase Dashboard

1. Open your browser
2. Go to: https://supabase.com/dashboard
3. Sign in to your account
4. Select your **ENACT project**

---

### Step 3: Navigate to Edge Functions

1. In the left sidebar, click **Edge Functions**
2. You should see your existing `legal-chat` function
3. Click on **legal-chat** to open it

---

### Step 4: Update the Function Code

1. You'll see the code editor
2. **Select all existing code** (Ctrl+A)
3. **Delete it**
4. **Paste the new code** you copied from `index.ts`
5. The new code includes:
   - `language` parameter extraction
   - Language-specific instructions for Gemini
   - Support for all 5 languages

---

### Step 5: Deploy

1. Click the **Deploy** button (usually at the top right)
2. Wait for deployment to complete (~30 seconds)
3. You should see a success message

---

### Step 6: Verify Deployment

1. Go back to Edge Functions list
2. Check the **Last Deployed** timestamp
3. It should show the current time

---

## ✅ Test the Multilingual Feature

### Test in Telugu:

1. Open your app: http://localhost:8081
2. Click the language selector (🇮🇳 icon in header)
3. Select **తెలుగు (Telugu)**
4. Go to Chat page
5. Type: "How do I file an FIR?"
6. **Expected**: AI responds in Telugu script

### Test in Tamil:

1. Switch language to **தமிழ் (Tamil)**
2. Type: "What are my rights?"
3. **Expected**: AI responds in Tamil script

### Test in Hindi:

1. Switch language to **हिन्दी (Hindi)**
2. Type: "Can I get free legal aid?"
3. **Expected**: AI responds in Devanagari script

### Test in Malayalam:

1. Switch language to **മലയാളം (Malayalam)**
2. Type: "How long does a case take?"
3. **Expected**: AI responds in Malayalam script

---

## 🔍 Troubleshooting

### If AI still responds in English after deployment:

**Check 1: Verify the code was deployed**

- Go to Edge Functions → legal-chat
- Check if the code includes `language = 'en'` on line 12
- Check if `languageInstructions` object exists around line 18

**Check 2: Check browser console**

- Open DevTools (F12)
- Go to Console tab
- Look for any errors
- Check Network tab → legal-chat request → Payload should show `"language": "te"`

**Check 3: Check Edge Function logs**

- In Supabase Dashboard → Edge Functions → legal-chat
- Click **Logs** tab
- Should see: "Processing legal query with X messages in language: te"
- If you see "language: en" when Telugu is selected, the frontend isn't sending it correctly

**Check 4: Clear browser cache**

- The old Edge Function response might be cached
- Hard refresh: Ctrl+Shift+R
- Or clear browser cache completely

---

## 🎯 Key Code Changes in Edge Function

### Line 12 - Extract language parameter:

```typescript
const { messages, language = "en" } = await req.json();
```

### Lines 18-24 - Language instructions:

```typescript
const languageInstructions: Record<string, string> = {
  en: "Respond in English.",
  te: "Respond in Telugu (తెలుగు). Use Telugu script for your entire response.",
  ta: "Respond in Tamil (தமிழ்). Use Tamil script for your entire response.",
  hi: "Respond in Hindi (हिन्दी). Use Devanagari script for your entire response.",
  ml: "Respond in Malayalam (മലയാളം). Use Malayalam script for your entire response.",
};
```

### Line 26 - Get instruction:

```typescript
const languageInstruction = languageInstructions[language] || languageInstructions.en;
```

### Added to system prompt (near end):

```typescript
═══════════════════════════════════════════════════════════════
LANGUAGE INSTRUCTION
═══════════════════════════════════════════════════════════════

${languageInstruction}

Important: For complex legal terms, provide brief explanations in the same language.
```

---

## ⏱️ Deployment Time

- **Copy code**: 30 seconds
- **Navigate to dashboard**: 30 seconds
- **Paste and deploy**: 1 minute
- **Verification**: 1 minute
- **Total**: ~3 minutes

---

## ✨ After Deployment

Once deployed, the multilingual feature will be **fully functional**:

✅ User selects Telugu → UI in Telugu → AI responds in Telugu
✅ User selects Tamil → UI in Tamil → AI responds in Tamil
✅ User selects Hindi → UI in Hindi → AI responds in Hindi
✅ User selects Malayalam → UI in Malayalam → AI responds in Malayalam
✅ User selects English → UI in English → AI responds in English

**The user can type in any language, and the AI will respond in the selected UI language!**

---

## 🎉 Result

After deployment, Phase 2 will be **100% functional** and production ready! 🚀
