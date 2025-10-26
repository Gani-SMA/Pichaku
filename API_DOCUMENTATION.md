# 📚 API DOCUMENTATION - TYSON LEGAL ASSISTANT

**Version**: 1.0.0  
**Last Updated**: January 26, 2025  
**Base URL**: `https://your-project.supabase.co`

---

## 📋 OVERVIEW

This document describes the API endpoints for the Tyson Legal Assistant application.

### Authentication

All API requests require authentication using Supabase JWT tokens.

```http
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting

- **Client-Side**: 10 requests per minute per user
- **Server-Side**: 10 requests per minute per user
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

---

## 🔐 AUTHENTICATION

### Sign Up

Create a new user account.

```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2025-01-26T10:00:00Z"
  }
}
```

### Sign In

Authenticate an existing user.

```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "..."
}
```

### Sign Out

Invalidate the current session.

```http
POST /auth/v1/logout
Authorization: Bearer <token>
```

**Response** (204 No Content)

---

## 💬 CHAT

### Send Message

Send a message to the AI legal assistant.

```http
POST /functions/v1/legal-chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "How do I file an FIR?"
    }
  ],
  "language": "en"
}
```

**Parameters**:

- `messages` (array, required): Array of message objects
  - `role` (string): "user" or "assistant"
  - `content` (string): Message content (max 2000 characters)
- `language` (string, optional): Language code (en, te, ta, hi, ml). Default: "en"

**Response** (200 OK):

```
Content-Type: text/event-stream

data: {"text": "To file an FIR..."}
data: {"text": " you need to..."}
data: [DONE]
```

**Response Headers**:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1706270400
```

**Error Response** (429 Too Many Requests):

```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 45
}
```

**Error Response** (401 Unauthorized):

```json
{
  "error": "Unauthorized"
}
```

---

## 🗂️ CONVERSATIONS

### List Conversations

Get all conversations for the authenticated user.

```http
GET /rest/v1/conversations?select=*&user_id=eq.<user-id>&deleted_at=is.null&order=updated_at.desc&limit=20&offset=0
Authorization: Bearer <token>
```

**Query Parameters**:

- `limit` (number, optional): Number of results (default: 20, max: 100)
- `offset` (number, optional): Pagination offset (default: 0)

**Response** (200 OK):

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "How to file an FIR",
    "created_at": "2025-01-26T10:00:00Z",
    "updated_at": "2025-01-26T10:30:00Z",
    "deleted_at": null,
    "is_pinned": false
  }
]
```

### Get Conversation

Get a specific conversation with messages.

```http
GET /rest/v1/conversations?select=*,messages(*)&id=eq.<conversation-id>
Authorization: Bearer <token>
```

**Response** (200 OK):

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "How to file an FIR",
  "created_at": "2025-01-26T10:00:00Z",
  "updated_at": "2025-01-26T10:30:00Z",
  "messages": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "role": "user",
      "content": "How do I file an FIR?",
      "created_at": "2025-01-26T10:00:00Z",
      "edited": false,
      "deleted_at": null
    }
  ]
}
```

### Create Conversation

Create a new conversation.

```http
POST /rest/v1/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "uuid",
  "title": "New conversation"
}
```

**Response** (201 Created):

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "New conversation",
  "created_at": "2025-01-26T10:00:00Z",
  "updated_at": "2025-01-26T10:00:00Z"
}
```

### Update Conversation

Update conversation details.

```http
PATCH /rest/v1/conversations?id=eq.<conversation-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "is_pinned": true
}
```

**Response** (200 OK):

```json
{
  "id": "uuid",
  "title": "Updated title",
  "is_pinned": true,
  "updated_at": "2025-01-26T10:35:00Z"
}
```

### Delete Conversation

Delete a conversation (soft delete).

```http
DELETE /rest/v1/conversations?id=eq.<conversation-id>
Authorization: Bearer <token>
```

**Response** (204 No Content)

### Search Conversations

Search conversations by title or content.

```http
GET /rest/v1/conversations?select=*&user_id=eq.<user-id>&or=(title.ilike.%<query>%,messages.content.ilike.%<query>%)
Authorization: Bearer <token>
```

**Response** (200 OK):

```json
[
  {
    "id": "uuid",
    "title": "Matching conversation",
    "created_at": "2025-01-26T10:00:00Z"
  }
]
```

---

## 💬 MESSAGES

### List Messages

Get messages for a conversation.

```http
GET /rest/v1/messages?select=*&conversation_id=eq.<conversation-id>&deleted_at=is.null&order=created_at.asc&limit=50&offset=0
Authorization: Bearer <token>
```

**Query Parameters**:

- `limit` (number, optional): Number of results (default: 50, max: 100)
- `offset` (number, optional): Pagination offset (default: 0)

**Response** (200 OK):

```json
[
  {
    "id": "uuid",
    "conversation_id": "uuid",
    "role": "user",
    "content": "How do I file an FIR?",
    "language": "en",
    "created_at": "2025-01-26T10:00:00Z",
    "updated_at": "2025-01-26T10:00:00Z",
    "edited": false,
    "deleted_at": null
  }
]
```

### Create Message

Create a new message.

```http
POST /rest/v1/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversation_id": "uuid",
  "role": "user",
  "content": "How do I file an FIR?",
  "language": "en"
}
```

**Response** (201 Created):

```json
{
  "id": "uuid",
  "conversation_id": "uuid",
  "role": "user",
  "content": "How do I file an FIR?",
  "created_at": "2025-01-26T10:00:00Z"
}
```

### Update Message

Update a message (edit).

```http
PATCH /rest/v1/messages?id=eq.<message-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated message content",
  "edited": true
}
```

**Response** (200 OK):

```json
{
  "id": "uuid",
  "content": "Updated message content",
  "edited": true,
  "updated_at": "2025-01-26T10:05:00Z"
}
```

### Delete Message

Delete a message (soft delete).

```http
PATCH /rest/v1/messages?id=eq.<message-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "deleted_at": "2025-01-26T10:10:00Z"
}
```

**Response** (200 OK)

---

## 👤 USER PROFILE

### Get Profile

Get the authenticated user's profile.

```http
GET /rest/v1/profiles?select=*&id=eq.<user-id>
Authorization: Bearer <token>
```

**Response** (200 OK):

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "preferred_language": "en",
  "created_at": "2025-01-26T10:00:00Z",
  "updated_at": "2025-01-26T10:00:00Z"
}
```

### Update Profile

Update user profile.

```http
PATCH /rest/v1/profiles?id=eq.<user-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "preferred_language": "hi"
}
```

**Response** (200 OK):

```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "preferred_language": "hi",
  "updated_at": "2025-01-26T10:15:00Z"
}
```

---

## 📊 ANALYTICS

### Track Event

Track a user event (client-side).

```typescript
import { analytics } from "@/lib/analytics";

analytics.track("message_sent", {
  conversation_id: "uuid",
  language: "en",
  message_length: 50,
});
```

**Events**:

- `message_sent`: User sends a message
- `conversation_created`: New conversation created
- `conversation_deleted`: Conversation deleted
- `message_edited`: Message edited
- `language_changed`: User changes language
- `export_conversation`: Conversation exported

---

## 🚨 ERROR CODES

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional information"
  }
}
```

---

## 🔧 SDK & CLIENT LIBRARIES

### JavaScript/TypeScript

```typescript
import { supabase } from "@/integrations/supabase/client";

// Send message
const { data, error } = await supabase.functions.invoke("legal-chat", {
  body: {
    messages: [{ role: "user", content: "How do I file an FIR?" }],
    language: "en",
  },
});

// List conversations
const { data: conversations } = await supabase
  .from("conversations")
  .select("*")
  .eq("user_id", userId)
  .is("deleted_at", null)
  .order("updated_at", { ascending: false });
```

---

## 📝 CHANGELOG

### Version 1.0.0 (2025-01-26)

- Initial API documentation
- Authentication endpoints
- Chat endpoints
- Conversation management
- Message CRUD operations
- User profile management

---

## 🔗 RESOURCES

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Postman Collection](./postman_collection.json) (coming soon)

---

**Document Version**: 1.0.0  
**Last Updated**: January 26, 2025  
**Prepared By**: Kiro AI Assistant
