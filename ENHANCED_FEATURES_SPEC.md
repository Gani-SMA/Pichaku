# Enhanced Legal Assistant - Feature Specification

## Overview

This document provides a comprehensive specification for enhancing the ENACT Legal Assistant with four major features:

1. **Enhanced AI Lawyer Persona** - Unbiased, professional legal guidance
2. **Multilingual Support** - Telugu, Tamil, Hindi, Malayalam, and English
3. **Document Upload & Analysis** - AI-powered legal document analysis
4. **Voice Input/Output** - Unlimited voice recording with step-by-step audio responses

---

## 📋 Specification Documents

The complete specification has been created in `.kiro/specs/enhanced-legal-assistant/`:

### 1. **requirements.md**

- Detailed user stories and acceptance criteria
- EARS-compliant requirements format
- 4 main requirements with 47 acceptance criteria total

### 2. **design.md**

- Technical architecture and component design
- API integrations and data models
- Implementation strategies for each feature
- Security and performance considerations

### 3. **tasks.md**

- 10 major tasks with 40+ sub-tasks
- Step-by-step implementation plan
- Clear dependencies and requirements mapping
- Estimated 8-week implementation timeline

---

## 🎯 Feature Summary

### Feature 1: Enhanced AI Lawyer Persona

**Goal**: Make the AI behave like an experienced Indian lawyer with zero bias

**Key Enhancements:**

- ✅ Explicit unbiased behavior rules in system prompt
- ✅ Step-by-step response formatting with clear numbering
- ✅ Cultural sensitivity for Indian context
- ✅ Emergency situation handling
- ✅ Complexity detection with lawyer recommendations
- ✅ Bias detection and response validation

**Current Status**: Partially implemented (basic system prompt exists)

**Implementation Effort**: 1 week

---

### Feature 2: Multilingual Support

**Goal**: Enable users to interact in their preferred Indian language

**Supported Languages:**

- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Hindi (हिन्दी)
- 🇮🇳 Malayalam (മലയാളം)
- 🇬🇧 English

**Key Features:**

- ✅ Language selector in chat interface
- ✅ Automatic language detection
- ✅ UI translation for all interface elements
- ✅ AI responses in selected language
- ✅ Language preference persistence
- ✅ Mid-conversation language switching
- ✅ Legal term explanations in native language

**Current Status**: Not implemented

**Implementation Effort**: 2-3 weeks

**Technical Stack:**

- Frontend: react-i18next for UI translations
- Backend: Gemini API multilingual capabilities
- Database: Language preference storage

---

### Feature 3: Document Upload & Analysis

**Goal**: Allow users to upload legal documents for AI analysis

**Supported Formats:**

- 📄 PDF (up to 10MB)
- 🖼️ JPG/PNG (with OCR)
- 📝 DOCX

**Key Features:**

- ✅ Drag-and-drop file upload
- ✅ Text extraction (PDF, OCR for images, DOCX parsing)
- ✅ AI-powered document analysis
- ✅ Step-by-step recommendations based on document
- ✅ Multi-page document support
- ✅ Regional language OCR support
- ✅ Document reference in conversation history

**Analysis Output:**

1. Document type and purpose
2. Key legal points (numbered)
3. Parties involved
4. Important dates and deadlines
5. User's rights and obligations
6. Potential issues or concerns
7. Recommended actions (step-by-step)
8. When to consult a lawyer

**Current Status**: Not implemented

**Implementation Effort**: 2-3 weeks

**Technical Stack:**

- Frontend: File upload component with validation
- Backend: Supabase Edge Function for analysis
- Storage: Supabase Storage for file storage
- OCR: Google Vision API or Tesseract.js
- AI: Gemini API for document analysis

---

### Feature 4: Voice Input with Unlimited Duration

**Goal**: Enable voice-based interaction with no time limits

**Key Features:**

**Voice Input:**

- ✅ Microphone button in chat interface
- ✅ Unlimited recording duration
- ✅ Visual recording indicators (waveform/pulsing icon)
- ✅ Elapsed time display
- ✅ Speech-to-text transcription
- ✅ Transcription confirmation before sending
- ✅ Multi-language speech recognition
- ✅ Noise reduction
- ✅ Warning after 5 minutes (but continues recording)

**Voice Output:**

- ✅ Text-to-speech for AI responses
- ✅ Audio playback controls (play, pause, stop, replay)
- ✅ Auto-play option
- ✅ Language-specific voices
- ✅ Adjustable speech rate

**Current Status**: Not implemented

**Implementation Effort**: 2-3 weeks

**Technical Stack:**

- Frontend: MediaRecorder API for recording
- Backend: Google Speech-to-Text API
- TTS: Google Text-to-Speech API or Web Speech API
- Storage: Supabase Storage for audio files

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)             │
├─────────────────────────────────────────────────────────────┤
│  Chat Interface                                              │
│  ├── LanguageSelector (Telugu, Tamil, Hindi, Malayalam, EN) │
│  ├── DocumentUpload (PDF, JPG, PNG, DOCX)                  │
│  ├── VoiceRecorder (Unlimited duration)                     │
│  ├── AudioPlayer (Playback controls)                        │
│  └── MessageDisplay (Step-by-step formatting)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Supabase Edge Functions (Deno)                  │
├─────────────────────────────────────────────────────────────┤
│  ├── legal-chat (Enhanced with multilingual support)        │
│  ├── analyze-document (Text extraction + AI analysis)       │
│  └── speech-to-text (Audio transcription)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
├─────────────────────────────────────────────────────────────┤
│  ├── Gemini API 2.0 Flash (AI responses)                   │
│  ├── Google Speech-to-Text (Voice transcription)            │
│  ├── Google Text-to-Speech (Audio responses)                │
│  ├── Google Vision API (OCR for images)                     │
│  └── Supabase Storage (Files and audio storage)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Changes

### New Tables:

```sql
-- Language preferences
ALTER TABLE profiles
ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'en';

-- Message language tracking
ALTER TABLE messages
ADD COLUMN language VARCHAR(5) DEFAULT 'en';

-- Document uploads
CREATE TABLE document_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  extracted_text TEXT,
  analysis JSONB,
  language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Voice recordings
CREATE TABLE voice_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_path TEXT NOT NULL,
  transcription TEXT,
  language VARCHAR(5) DEFAULT 'en',
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔐 Security Considerations

1. **File Upload Security**
   - File type validation (whitelist only)
   - File size limits (10MB max)
   - Malware scanning
   - Secure storage with RLS policies

2. **Voice Recording Security**
   - Explicit microphone permissions
   - Secure audio file storage
   - Automatic deletion after 30 days
   - Encrypted transmission

3. **Data Privacy**
   - Encrypted document storage
   - User data deletion on request
   - Compliance with Indian data protection laws
   - No data sharing with third parties

---

## 💰 Cost Estimates

### Google Cloud APIs (Pay-as-you-go):

1. **Speech-to-Text**
   - $0.006 per 15 seconds
   - ~$0.024 per minute
   - ~$1.44 per hour of audio

2. **Text-to-Speech**
   - $4 per 1 million characters (Standard)
   - $16 per 1 million characters (WaveNet/Neural)

3. **Vision API (OCR)**
   - $1.50 per 1,000 images (first 1,000 free/month)

4. **Gemini API**
   - Free tier: 1,500 requests/day
   - Paid: $0.075 per 1M input tokens

### Estimated Monthly Cost (1,000 active users):

- Speech-to-Text: ~$50-100
- Text-to-Speech: ~$20-40
- Vision API: ~$30-50
- Gemini API: ~$50-100 (if exceeding free tier)
- **Total: ~$150-290/month**

---

## 📈 Implementation Timeline

### Phase 1: Enhanced AI Persona (Week 1)

- Update system prompt
- Add bias detection
- Implement step-by-step formatting

### Phase 2: Multilingual Support (Weeks 2-3)

- Frontend: Language selector, UI translations
- Backend: Multilingual AI responses
- Database: Language preference storage

### Phase 3: Document Upload (Weeks 4-5)

- Frontend: File upload component
- Backend: Text extraction and analysis
- Storage: Supabase Storage integration

### Phase 4: Voice Input/Output (Weeks 6-7)

- Frontend: Voice recorder and audio player
- Backend: Speech-to-text and text-to-speech
- Storage: Audio file management

### Phase 5: Testing & Optimization (Week 8)

- Integration testing
- Performance optimization
- Bug fixes
- User acceptance testing

**Total Duration: 8 weeks**

---

## ✅ Success Criteria

### Feature 1: Enhanced AI Persona

- [ ] AI responses follow step-by-step format 100% of the time
- [ ] Zero bias detected in sample testing (100 diverse test cases)
- [ ] User satisfaction score > 4.5/5

### Feature 2: Multilingual Support

- [ ] All 5 languages fully supported
- [ ] Translation accuracy > 95%
- [ ] Language switching works seamlessly
- [ ] UI fully translated in all languages

### Feature 3: Document Upload

- [ ] Supports PDF, JPG, PNG, DOCX formats
- [ ] Text extraction accuracy > 90%
- [ ] Analysis completion time < 15 seconds
- [ ] User finds analysis helpful (> 4/5 rating)

### Feature 4: Voice Input/Output

- [ ] Recording works without time limits
- [ ] Transcription accuracy > 85% for all languages
- [ ] TTS quality rated > 4/5 by users
- [ ] Voice feature adoption > 30% of users

---

## 📚 Documentation

### User Documentation:

- How to use multilingual feature
- How to upload and analyze documents
- How to use voice input and output
- Video tutorials for each feature

### Developer Documentation:

- API documentation for new Edge Functions
- Integration guide for Google Cloud APIs
- Database schema documentation
- Deployment guide

---

## 🚀 Next Steps

1. **Review this specification** with stakeholders
2. **Approve the design** and implementation plan
3. **Set up Google Cloud APIs** and get API keys
4. **Start Phase 1** - Enhanced AI Persona
5. **Iterate based on feedback** after each phase

---

## 📞 Support

For questions or clarifications about this specification:

- Review the detailed documents in `.kiro/specs/enhanced-legal-assistant/`
- Check the requirements.md for acceptance criteria
- Check the design.md for technical details
- Check the tasks.md for implementation steps

---

**Status**: ✅ **SPECIFICATION COMPLETE**

All requirements, design, and implementation tasks have been documented. Ready to begin development!
