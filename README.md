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

## 📱 Supported Platforms & Technologies

- **Mobile**: React Native (Expo SDK 52) with React Navigation, Safe Area Context, and SVG icons.
- **Web**: React Native Web for local browser preview.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ODM) with automatic zero-config In-Memory MongoDB fallback.
- **Data Persistence**: React Native AsyncStorage client-side cache + MongoDB persistent storage.

