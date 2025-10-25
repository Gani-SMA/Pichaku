# Phase 1 Push Checklist

## Pre-Push Verification

### ✅ Code Quality

- [x] TypeScript type check passed
- [x] ESLint passed (7 acceptable warnings from UI library)
- [x] No runtime errors
- [x] Edge function deployed successfully

### ✅ Files to Include

- [x] `src/utils/responseValidator.ts` (new)
- [x] `src/utils/complexityDetector.ts` (new)
- [x] `supabase/functions/legal-chat/index.ts` (modified)
- [x] `src/pages/Chat.tsx` (modified)
- [x] `PHASE_1_COMPLETE.md` (documentation)
- [x] `PHASE_1_COMMIT_MESSAGE.md` (commit message)
- [x] `.kiro/specs/enhanced-legal-assistant/` (spec files)
- [x] `ENHANCED_FEATURES_SPEC.md` (overall spec)

### ✅ Documentation

- [x] Phase 1 completion document created
- [x] Commit message prepared
- [x] Spec files complete

## Git Commands

### Option 1: Push to New Repo

```bash
# Navigate to project
cd Tyson

# Initialize git (if not already)
git init

# Add all Phase 1 files
git add src/utils/responseValidator.ts
git add src/utils/complexityDetector.ts
git add supabase/functions/legal-chat/index.ts
git add src/pages/Chat.tsx
git add PHASE_1_COMPLETE.md
git add PHASE_1_COMMIT_MESSAGE.md
git add PUSH_CHECKLIST.md
git add .kiro/specs/enhanced-legal-assistant/
git add ENHANCED_FEATURES_SPEC.md

# Or add all changes
git add .

# Commit with message
git commit -m "feat: Phase 1 - Enhanced AI Lawyer Persona with zero-bias mandate and complexity detection"

# Add remote (replace with your new repo URL)
git remote add origin <YOUR_NEW_REPO_URL>

# Push to main branch
git push -u origin main
```

### Option 2: Create New Branch in Existing Repo

```bash
# Create and switch to new branch
git checkout -b phase-1-enhanced-ai-persona

# Add all changes
git add .

# Commit
git commit -m "feat: Phase 1 - Enhanced AI Lawyer Persona with zero-bias mandate and complexity detection"

# Push branch
git push -u origin phase-1-enhanced-ai-persona
```

## Post-Push Verification

### On New Repo:

- [ ] Verify all files are present
- [ ] Check README is clear
- [ ] Verify .env.example is included (not .env)
- [ ] Test clone and setup on fresh machine

### Environment Setup for New Repo:

```bash
# Clone
git clone <YOUR_NEW_REPO_URL>
cd <repo-name>

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database setup
npm run db:setup

# Start dev server
npm run dev
```

## Important Notes

### ⚠️ Don't Push:

- `.env` file (contains secrets)
- `node_modules/` (too large)
- `dist/` (build artifacts)
- `.supabase/` (local Supabase data)

### ✅ Do Push:

- `.env.example` (template)
- All source code
- Documentation
- Spec files
- Configuration files

## Supabase Edge Function

The enhanced legal-chat function is already deployed to:

```
https://majxoxvsrbevthtnefyg.supabase.co/functions/v1/legal-chat
```

For new repo, you'll need to:

1. Link to your Supabase project: `npx supabase link`
2. Deploy function: `npx supabase functions deploy legal-chat`
3. Set secrets: `npx supabase secrets set GEMINI_API_KEY=your_key`

## Testing After Push

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Run dev server
npm run dev
```

## Ready to Push?

Once you've verified everything above, you're ready to push Phase 1 to your new repo!

After pushing, we can continue with:

- **Phase 2**: Multilingual Support (Telugu, Tamil, Hindi, Malayalam, English)
- **Phase 3**: Document Upload & Analysis
- **Phase 4**: Voice Input/Output
- **Phase 5**: Testing & Integration
