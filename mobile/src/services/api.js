import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGGED_IN_USER_ID } from '../constants/theme';

// Android emulator routes host localhost as 10.0.2.2; Web & iOS use localhost
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

let currentBaseUrl = DEFAULT_HOST;

export const setApiBaseUrl = (url) => {
  currentBaseUrl = url;
};

export const getApiBaseUrl = () => currentBaseUrl;

const apiClient = axios.create({
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': LOGGED_IN_USER_ID,
  },
});

const STORAGE_KEY_REQUESTED = '@docconnect_requested_user_ids';

/**
 * Retrieve locally persisted requested user IDs from AsyncStorage
 */
export const getLocalRequestedIds = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY_REQUESTED);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.warn('Error reading from AsyncStorage:', err);
    return [];
  }
};

/**
 * Persist a requested user ID to AsyncStorage
 */
export const saveLocalRequestedId = async (userId) => {
  try {
    const existing = await getLocalRequestedIds();
    if (!existing.includes(userId)) {
      const updated = [...existing, userId];
      await AsyncStorage.setItem(STORAGE_KEY_REQUESTED, JSON.stringify(updated));
      return updated;
    }
    return existing;
  } catch (err) {
    console.warn('Error saving to AsyncStorage:', err);
    return [];
  }
};

/**
 * GET /posts - Fetch 5 feed posts
 */
export const fetchPosts = async () => {
  const url = `${currentBaseUrl}/posts`;
  const response = await apiClient.get(url);
  return response.data.posts || [];
};

/**
 * GET /users - Fetch users for Discover screen, merging backend and local storage requested states
 */
export const fetchUsers = async (currentUserId = LOGGED_IN_USER_ID) => {
  const url = `${currentBaseUrl}/users?currentUserId=${currentUserId}`;
  const response = await apiClient.get(url);
  const data = response.data;

  // Read local storage to ensure persistent state across app restarts
  const localRequested = await getLocalRequestedIds();
  const apiRequested = data.requestedUserIds || [];
  const mergedRequestedSet = new Set([...localRequested, ...apiRequested]);

  // Update local storage with any new IDs from the server
  if (apiRequested.length > 0) {
    await AsyncStorage.setItem(
      STORAGE_KEY_REQUESTED,
      JSON.stringify(Array.from(mergedRequestedSet))
    );
  }

  const usersWithStatus = (data.users || []).map((user) => ({
    ...user,
    isRequested: mergedRequestedSet.has(user._id.toString()),
  }));

  return {
    currentUser: data.currentUser,
    users: usersWithStatus,
    requestedUserIds: Array.from(mergedRequestedSet),
  };
};

/**
 * GET /users/me - Fetch current logged-in user profile
 */
export const fetchCurrentUser = async (currentUserId = LOGGED_IN_USER_ID) => {
  const url = `${currentBaseUrl}/users/me?currentUserId=${currentUserId}`;
  const response = await apiClient.get(url);
  return response.data.user;
};

/**
 * POST /connect - Send connection request and persist requested state
 */
export const sendConnectRequest = async (recipientId, senderId = LOGGED_IN_USER_ID) => {
  // Optimistically persist to local storage immediately
  await saveLocalRequestedId(recipientId);

  // Send request to backend
  const url = `${currentBaseUrl}/connect`;
  const response = await apiClient.post(url, {
    recipientId,
    senderId,
  });

  return response.data;
};
