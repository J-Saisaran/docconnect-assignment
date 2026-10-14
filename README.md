# DocConnect — React Native Full-Stack Assignment

> **Submission for TheBrandopedia.in React Native Full-Stack Developer Role**  
> Built with **React Native (Expo SDK 57)**, **Node.js**, **Express**, and **MongoDB (Mongoose)**.

---

## 📱 Project Overview

**DocConnect** is a professional networking mobile application for healthcare professionals (doctors, nurses, surgeons, and medical students). 

This submission implements the two required screens matching the Figma specifications and Developer Handoff guide down to the pixel:
1. **Home Screen (The Feed)**: Current user's profile card at the top (Dr. Arjun Mehta), followed by a scrollable feed of 5 clinical posts with author details, images, like toggle, and share indicators. Includes dedicated loading and error states.
2. **Discover Screen (People You May Know)**: A 2-column grid of healthcare professionals with real-time **Connect → Requested** flow. The `Requested` state is persisted in MongoDB and in-app local storage, guaranteeing it survives app restart.

---

## 🎨 Design & Token Specifications (Developer Handoff)

All colors, typography, and assets strictly follow the `Developer Handsoff.pdf`:

- **Primary Teal**:
  - Primary Dark: `#027878` (Headings, active tabs, brand logo)
  - Primary: `#02B6B6` (Buttons, CTA, active states)
  - Primary Light: `#F1FAFA` (Badges, pill backgrounds, requested button fill)
- **Neutrals**:
  - Text Primary: `#29292B` (Body text, headers)
  - Text Secondary: `#7F7F80` (Subtitles, metadata, timestamps)
  - Border: `#EEEEEF` (Dividers, card borders)
  - Background Light: `#F8F8F9` (Page container background)
  - White: `#FFFFFF` (Cards, surfaces)
- **Typography**: `DM Sans` (Regular 400, Medium 500, Bold 700) loaded via `@expo-google-fonts/dm-sans`.
- **Assets**: Original SVGs (`icon-home-filled`, `icon-search-filled`, `icon-settings-slider`, `icon-add-user`, etc.) converted to crisp vector components.

---

## 🗂️ Repository Structure

```text
├── backend/                        # Node.js + Express + MongoDB REST API
│   ├── public/assets/              # Statically served post and profile images
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection (Local + Zero-config In-Memory fallback)
│   │   ├── controllers/
│   │   │   ├── connectController.js# Handles POST /connect and requested states
│   │   │   ├── postController.js   # Handles GET /posts
│   │   │   └── userController.js   # Handles GET /users and GET /users/me
│   │   ├── models/
│   │   │   ├── ConnectionRequest.js# Schema with unique compound index (sender + recipient)
│   │   │   ├── Post.js             # Post schema (content, author ref, image, counts)
│   │   │   └── User.js             # User schema (name, occupation, profileImage, connects)
│   │   ├── routes/
│   │   │   ├── connectRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── seed.js                 # Seed script: 5 deterministic users & 5 clinical posts
│   │   └── server.js               # Express application entry point (auto-seeds on start)
│   ├── .env.example
│   └── package.json
│
├── mobile/                         # React Native (Expo) Mobile Application
│   ├── assets/assignment/          # Bundled assets (icons, post images, profile images)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorState.js       # User-friendly error card with retry button
│   │   │   ├── Header.js           # Top brand header ("DocConnect" + teal Plus button)
│   │   │   ├── LoadingState.js     # Themed activity indicator
│   │   │   ├── PostCard.js         # Feed post card with author, image, like & share actions
│   │   │   ├── ProfileHeader.js    # Logged-in doctor's top profile card
│   │   │   ├── SvgIcons.js         # Handcrafted vector icons from assignment SVGs
│   │   │   └── UserCard.js         # 2-column discover card with Connect/Requested toggle
│   │   ├── constants/
│   │   │   ├── assetsMap.js        # Maps backend paths to bundled local assets for instant load
│   │   │   └── theme.js            # Design tokens, color palette, font styles
│   │   ├── navigation/
│   │   │   └── BottomTabNavigator.js# 3-tab bottom bar (Home, Discover, Chat notice)
│   │   ├── screens/
│   │   │   ├── DiscoverScreen.js   # People you may know grid with instant connect flow
│   │   │   └── HomeScreen.js       # Profile card + 5-post scrollable feed
│   │   └── services/
│   │       └── api.js              # Axios client + AsyncStorage persistence logic
│   ├── App.js                      # Root component with DM Sans font loader & Navigation
│   ├── app.json
│   └── package.json
│
├── README.md                       # Comprehensive setup, run guide, and interview notes
└── .gitignore
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **npm**: v9 or higher
- Optional: Local MongoDB installed or MongoDB Atlas URI (if not running, the backend automatically uses an embedded in-memory MongoDB instance so it runs out-of-the-box!)

---

### Step 1: Backend Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   npm install
   ```

2. *(Optional)* Configure `.env`:
   ```bash
   cp .env.example .env
   ```
   > **Note on MongoDB**: If you have a local MongoDB daemon running, it will connect to `mongodb://127.0.0.1:27017/docconnect`. If not, `mongodb-memory-server` **automatically boots an in-memory database with zero configuration**.

3. Run the database seed script:
   ```bash
   npm run seed
   ```
   This clears existing records and seeds:
   - **5 Users** (with deterministic ObjectIds):
     - `65f000000000000000000001`: **Dr. Arjun Mehta** (Logged-in user, Cardiology, Chennai)
     - `65f000000000000000000002`: **Dr. Priya Sharma** (Healthcare Technology, Bengaluru)
     - `65f000000000000000000003`: **Dr. Rajesh Kumar** (Neurology, Mumbai)
     - `65f000000000000000000004`: **Dr. Sneha Patel** (Pediatrics, Delhi NCR)
     - `65f000000000000000000005`: **Dr. Vikram Singh** (Orthopedics, Hyderabad)
   - **5 Posts** with medical content and image references.

4. Start the backend server:
   ```bash
   npm start
   ```
   Server runs on **`http://localhost:5000`**.

---

### Step 2: Mobile App Setup (React Native Expo)

1. Open a new terminal and navigate to `mobile`:
   ```bash
   cd mobile
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npm start
   ```

3. To view the app:
   - **Web**: Press `w` in the terminal to view in your browser.
   - **Android Emulator**: Press `a` (uses `10.0.2.2:5000` to reach backend automatically).
   - **Physical Device**: Scan the QR code with the **Expo Go** app (iOS Camera or Android Expo Go). If using a physical phone on the same Wi-Fi, ensure your laptop's local IP (e.g., `http://192.168.x.x:5000`) is set in `mobile/src/services/api.js`.

---

## 📡 API Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/posts` | Returns 5 feed posts populated with author info (name, occupation, avatar). |
| `GET` | `/users` | Returns users for Discover screen. When queried with `?currentUserId=...`, annotates each user with `isRequested: boolean` and returns `requestedUserIds`. |
| `GET` | `/users/me` | Returns current user profile (Dr. Arjun Mehta). |
| `POST` | `/connect` | Accepts `{ recipientId, senderId }`. Upserts a connection request and marks status as `requested`. |

### Verification via cURL / PowerShell:
```powershell
# 1. Fetch posts
curl http://localhost:5000/posts

# 2. Fetch users
curl http://localhost:5000/users

# 3. Send connect request to Dr. Priya Sharma
curl -X POST http://localhost:5000/connect -H "Content-Type: application/json" -d '{"recipientId":"65f000000000000000000002"}'
```

---

## 🔄 Connect & "Requested" Persistence Architecture

The requirement states:
> *"After tapping it, the button changes to Requested, and it must still say Requested after the app is closed and reopened."*

This is guaranteed via a **dual-persistence strategy**:
1. **Database Level**: 
   - `ConnectionRequest` collection records `{ sender: currentUserId, recipient: targetUserId, status: 'requested' }` with a unique compound index.
   - `GET /users` checks all pending connection requests from `currentUserId` and sets `isRequested: true`.
2. **Client-Side Cache Level (`AsyncStorage`)**:
   - As soon as the user taps **Connect**, `saveLocalRequestedId` caches the ID in `@docconnect_requested_user_ids`.
   - On app startup or refresh, `fetchUsers` immediately merges local storage with API results.
   - Even if the app is killed, restarted offline, or reloaded, the button **instantly renders "Requested"** without layout shifts or flashes.

---

## 🎤 Interview & Walkthrough Preparation

### 1. How to Add Phone OTP Authentication to this App
If asked during the walkthrough how authentication would be added:
1. **Backend**:
   - Add a `phone` and `isVerified` field to the `User` schema.
   - Create an `Otp` schema with TTL index (e.g. expires in 5 minutes) storing hashed OTPs.
   - **`POST /auth/send-otp`**: Generates a 6-digit cryptographically secure OTP, saves hashed OTP in DB, and dispatches SMS via Twilio or MSG91.
   - **`POST /auth/verify-otp`**: Verifies submitted OTP against hash. If valid, generates JWT **Access Token** (short-lived, 15m) and **Refresh Token** (long-lived, 30d stored in httpOnly cookie or DB).
2. **Mobile App**:
   - Add `AuthContext` to manage `userToken` and `isAuthenticated` state.
   - Store JWT in `expo-secure-store` (hardware-backed keychain/keystore).
   - Use Axios interceptors: attach `Bearer ${token}` to all outgoing requests and automatically handle 401s by refreshing the access token.

### 2. How to Add Real-Time Chat to this App
If asked during the walkthrough how chat would be added:
1. **Backend**:
   - Use **Socket.io** attached to the Express HTTP server.
   - Schemas:
     - `Conversation`: `{ participants: [User], lastMessage: Message, unreadCounts: Map }`
     - `Message`: `{ conversationId, sender: User, text, sharedPost: Post, createdAt }`
   - Socket Events:
     - `socket.join(conversationId)`
     - `send_message`: Saves message to MongoDB, broadcasts `new_message` to room, and sends push notifications (via Expo Push Notification service) to offline recipients.
2. **Mobile App**:
   - Initialize `socket.io-client` in a `ChatContext`.
   - Implement optimistic UI updates: immediately display the message in the chat bubble before socket ACK.
   - Support rich card rendering: if `message.sharedPost` exists, render the mini `PostCard` preview directly in the chat bubble with a "View Post" action.

### 3. Quick Live Code Modifications (Cheat Sheet)
- **Change Primary Brand Color**: Modify `mobile/src/constants/theme.js` -> `COLORS.primary` and `COLORS.primaryDark`.
- **Add Search Filter in Discover**: Logic is already modularized in `filteredUsers` in `mobile/src/screens/DiscoverScreen.js`.
- **Toggle Like Count**: Handled in `mobile/src/components/PostCard.js` -> `handleLikeToggle`.
- **Reset Requested Status**: Clear storage via `AsyncStorage.clear()` or call seed script `npm run seed`.

---

## ✉️ Submission Email Format

**To**: `hr@thebrandopedia.in`  
**Subject**: `Assignment Submission - [Your Name]`

```text
Dear Hiring Team,

I have completed the React Native Full-Stack Developer assignment for TheBrandopedia.in.

Please find the submission details below:
1. GitHub Repository: https://github.com/[Your-Username]/docconnect-assignment
2. Screen Recording Video: [Attach video or Google Drive link showing Home Feed, Discover Grid, Connect flow, and App Restart demonstrating persistent Requested state]
3. Documentation: The README in the repository includes full setup instructions, seed details, architecture diagrams, and walkthrough notes for OTP Auth & Chat.

I look forward to our Saturday in-person code walkthrough at your Chennai office!

Best regards,
[Your Name]
[Your Phone Number]
[Your Portfolio / LinkedIn]
```
