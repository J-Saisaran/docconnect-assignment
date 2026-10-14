import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGGED_IN_USER_ID } from '../constants/theme';

// Seeded fallback data ensuring 100% reliability even if phone Wi-Fi isolates network ports
export const FALLBACK_CURRENT_USER = {
  _id: '65f000000000000000000001',
  name: 'Dr. Arjun Mehta',
  occupation: 'Cardiology',
  profileImage: '/assets/Profile image/Image-3.png',
  location: 'Chennai, Tamil Nadu',
  connectsCount: 2,
};

export const FALLBACK_USERS = [
  {
    _id: '65f000000000000000000002',
    name: 'Dr. Priya Sharma',
    occupation: 'Healthcare Technology',
    profileImage: '/assets/Profile image/Image-1.png',
    location: 'Bengaluru, Karnataka',
    connectsCount: 2,
  },
  {
    _id: '65f000000000000000000003',
    name: 'Dr. Rajesh Kumar',
    occupation: 'Neurology',
    profileImage: '/assets/Profile image/Image-2.png',
    location: 'Mumbai, Maharashtra',
    connectsCount: 2,
  },
  {
    _id: '65f000000000000000000004',
    name: 'Dr. Sneha Patel',
    occupation: 'Pediatrics',
    profileImage: '/assets/Profile image/Image-4.png',
    location: 'Delhi NCR',
    connectsCount: 2,
  },
  {
    _id: '65f000000000000000000005',
    name: 'Dr. Vikram Singh',
    occupation: 'Orthopedics',
    profileImage: '/assets/Profile image/Image.png',
    location: 'Hyderabad, Telangana',
    connectsCount: 2,
  },
];

export const FALLBACK_POSTS = [
  {
    _id: '65f100000000000000000001',
    author: {
      name: 'Docconnect',
      occupation: 'Healthcare Technology',
      profileImage: '/assets/Profile image/Image-1.png',
    },
    content: "Welcome to Docconnect! We're building India's largest healthcare professional network. Connect with doctors, nurses, pharmacists, and medical students across the country. Let's transform healthcare collaboration together. 🇮🇳",
    image: '/assets/Post image/create-post-image-5@2x.png',
    likesCount: 5,
    sharesCount: 3,
  },
  {
    _id: '65f100000000000000000002',
    author: {
      name: 'Dr. Arjun Mehta',
      occupation: 'Cardiology',
      profileImage: '/assets/Profile image/Image-3.png',
    },
    content: "We make sure that your loved ones get all the support they need and feel at home. Dedicated geriatric clinical care and compassionate rehabilitation for senior citizens. 👵❤️",
    image: '/assets/Post image/create-post-image-1@2x.png',
    carouselImages: ['1', '2'],
    likesCount: 5,
    sharesCount: 3,
  },
  {
    _id: '65f100000000000000000003',
    author: {
      name: 'Dr. Sneha Patel',
      occupation: 'Pediatrics',
      profileImage: '/assets/Profile image/Image-4.png',
    },
    content: "Healthcare Professional Wellness Week: Tuesday is dedicated to mental health and clinical mindfulness. Recharging is essential to avoid burnout and provide high-quality care. 🧘‍♂️✨",
    image: '/assets/Post image/create-post-image-2@2x.png',
    likesCount: 9,
    sharesCount: 4,
  },
  {
    _id: '65f100000000000000000004',
    author: {
      name: 'Dr. Rajesh Kumar',
      occupation: 'Neurology',
      profileImage: '/assets/Profile image/Image-2.png',
    },
    content: "Not all heroes wear capes. Some wear scrubs... Saluting our tireless emergency residents, OT technicians, and intensive care nurses working around the clock. 🩺🏥",
    image: '/assets/Post image/create-post-image-3@2x.png',
    likesCount: 14,
    sharesCount: 7,
  },
  {
    _id: '65f100000000000000000005',
    author: {
      name: 'Dr. Vikram Singh',
      occupation: 'Orthopedics',
      profileImage: '/assets/Profile image/Image.png',
    },
    content: "World Alzheimer's & Dementia Awareness: Between what was and what is, there is presence. Early clinical intervention and compassionate communication make a profound difference. 🧠💜",
    image: '/assets/Post image/create-post-image-4@2x.png',
    likesCount: 11,
    sharesCount: 5,
  },
];

const resolveBaseUrl = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      return `http://${window.location.hostname}:5000`;
    }
    return 'http://localhost:5000';
  }

  const hostUri =
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants?.manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:5000`;
    }
  }

  const LOCAL_PC_IP = '192.168.31.168';
  return `http://${LOCAL_PC_IP}:5000`;
};

let currentBaseUrl = resolveBaseUrl();

export const setApiBaseUrl = (url) => {
  currentBaseUrl = url;
};

export const getApiBaseUrl = () => currentBaseUrl;

const apiClient = axios.create({
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': LOGGED_IN_USER_ID,
  },
});

const STORAGE_KEY_REQUESTED = '@docconnect_requested_user_ids';
const STORAGE_KEY_CANCELLED = '@docconnect_cancelled_user_ids';

export const getLocalRequestedIds = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY_REQUESTED);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    return [];
  }
};

export const getLocalCancelledIds = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY_CANCELLED);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    return [];
  }
};

export const saveLocalRequestedId = async (userId) => {
  try {
    const idStr = userId.toString();
    // 1. Remove from cancelled list
    const cancelled = await getLocalCancelledIds();
    const updatedCancelled = cancelled.filter((id) => id !== idStr);
    await AsyncStorage.setItem(STORAGE_KEY_CANCELLED, JSON.stringify(updatedCancelled));

    // 2. Add to requested list
    const existing = await getLocalRequestedIds();
    if (!existing.includes(idStr)) {
      const updated = [...existing, idStr];
      await AsyncStorage.setItem(STORAGE_KEY_REQUESTED, JSON.stringify(updated));
      return updated;
    }
    return existing;
  } catch (err) {
    return [];
  }
};

/**
 * GET /posts - Fetch 5 feed posts with graceful fallback
 */
export const fetchPosts = async () => {
  try {
    const url = `${currentBaseUrl}/posts`;
    const response = await apiClient.get(url);
    if (response.data?.posts && response.data.posts.length > 0) {
      return response.data.posts;
    }
    return FALLBACK_POSTS;
  } catch (err) {
    console.warn(`[DocConnect] Backend unreachable at ${currentBaseUrl}, using local seeded posts:`, err.message);
    return FALLBACK_POSTS;
  }
};

/**
 * GET /users - Fetch users for Discover screen with persistence
 */
export const fetchUsers = async (currentUserId = LOGGED_IN_USER_ID) => {
  const localRequested = await getLocalRequestedIds();
  const localCancelled = await getLocalCancelledIds();
  const cancelledSet = new Set(localCancelled);

  try {
    const url = `${currentBaseUrl}/users?currentUserId=${currentUserId}`;
    const response = await apiClient.get(url);
    const data = response.data;

    // Filter out any IDs that have been explicitly cancelled
    const apiRequested = (data.requestedUserIds || []).filter((id) => !cancelledSet.has(id.toString()));
    const activeLocal = localRequested.filter((id) => !cancelledSet.has(id.toString()));

    const mergedRequestedSet = new Set([...activeLocal, ...apiRequested]);

    await AsyncStorage.setItem(
      STORAGE_KEY_REQUESTED,
      JSON.stringify(Array.from(mergedRequestedSet))
    );

    const usersWithStatus = (data.users || []).map((user) => ({
      ...user,
      isRequested: mergedRequestedSet.has(user._id.toString()),
    }));

    return {
      currentUser: data.currentUser || FALLBACK_CURRENT_USER,
      users: usersWithStatus,
      requestedUserIds: Array.from(mergedRequestedSet),
    };
  } catch (err) {
    console.warn(`[DocConnect] Backend unreachable at ${currentBaseUrl}, using local seeded users:`, err.message);
    const activeLocal = localRequested.filter((id) => !cancelledSet.has(id.toString()));
    const localRequestedSet = new Set(activeLocal);

    const usersWithStatus = FALLBACK_USERS.map((user) => ({
      ...user,
      isRequested: localRequestedSet.has(user._id.toString()),
    }));

    return {
      currentUser: FALLBACK_CURRENT_USER,
      users: usersWithStatus,
      requestedUserIds: Array.from(localRequestedSet),
    };
  }
};


/**
 * GET /users/me - Fetch current logged-in user profile
 */
export const fetchCurrentUser = async (currentUserId = LOGGED_IN_USER_ID) => {
  try {
    const url = `${currentBaseUrl}/users/me?currentUserId=${currentUserId}`;
    const response = await apiClient.get(url);
    return response.data.user || FALLBACK_CURRENT_USER;
  } catch (err) {
    return FALLBACK_CURRENT_USER;
  }
};

/**
 * POST /connect - Send connection request and persist requested state
 */
export const sendConnectRequest = async (recipientId, senderId = LOGGED_IN_USER_ID) => {
  const idStr = recipientId.toString();

  // Always persist to local storage immediately
  await saveLocalRequestedId(idStr);

  try {
    const url = `${currentBaseUrl}/connect`;
    const response = await apiClient.post(url, {
      recipientId: idStr,
      senderId,
    });
    return response.data;
  } catch (err) {
    console.warn('[DocConnect] Connect saved locally (backend unreachable):', err.message);
    return { success: true, recipientId: idStr, status: 'requested' };
  }
};

/**
 * Cancel connection request for a specific user ID
 * Persists cancellation across reloads, updates local storage, and notifies backend.
 */
export const cancelConnectRequest = async (recipientId, senderId = LOGGED_IN_USER_ID) => {
  try {
    const idStr = recipientId.toString();

    // 1. Remove from requested list
    const existingRequested = await getLocalRequestedIds();
    const updatedRequested = existingRequested.filter((id) => id !== idStr);
    await AsyncStorage.setItem(STORAGE_KEY_REQUESTED, JSON.stringify(updatedRequested));

    // 2. Add to cancelled list so reloads/refreshes do not revive it
    const existingCancelled = await getLocalCancelledIds();
    if (!existingCancelled.includes(idStr)) {
      const updatedCancelled = [...existingCancelled, idStr];
      await AsyncStorage.setItem(STORAGE_KEY_CANCELLED, JSON.stringify(updatedCancelled));
    }

    // 3. Notify backend via DELETE and POST /connect/cancel
    await apiClient.delete(`${currentBaseUrl}/connect/${idStr}`).catch(() => {});
    await apiClient.post(`${currentBaseUrl}/connect/cancel`, { recipientId: idStr, senderId }).catch(() => {});
    await apiClient.post(`${currentBaseUrl}/connect`, { recipientId: idStr, senderId, action: 'cancel' }).catch(() => {});

    return true;
  } catch (err) {
    console.warn('[DocConnect] Error cancelling connect request:', err);
    return false;
  }
};

// Alias for backwards compatibility
export const removeLocalRequestedId = cancelConnectRequest;

/**
 * Reset all connection requests (clears AsyncStorage + MongoDB records)
 */
export const clearAllRequestedState = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_REQUESTED);

    // Mark all users as cancelled locally so fresh state is maintained on reloads
    const allUserIds = FALLBACK_USERS.map((u) => u._id.toString());
    await AsyncStorage.setItem(STORAGE_KEY_CANCELLED, JSON.stringify(allUserIds));

    await apiClient.post(`${currentBaseUrl}/connect/reset`).catch(() => {});
    await apiClient.get(`${currentBaseUrl}/connect/reset`).catch(() => {});
    return true;
  } catch (err) {
    console.warn('Error clearing requested state:', err);
    return false;
  }
};


