import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { Header } from '../components/Header';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostCard } from '../components/PostCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { fetchPosts, fetchCurrentUser } from '../services/api';

export const HomeScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [userData, postsData] = await Promise.all([
        fetchCurrentUser().catch((err) => {
          console.warn('Could not fetch user profile:', err.message);
          return null;
        }),
        fetchPosts(),
      ]);

      if (userData) {
        setCurrentUser(userData);
      }
      setPosts(postsData);
    } catch (err) {
      console.error('HomeScreen load error:', err);
      setError(err.message || 'Failed to connect to DocConnect server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handlePlusPress = () => {
    Alert.alert(
      'Create Post',
      'Post creation is scoped for the next release as per project instructions.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* DocConnect Top Header */}
      <Header onPlusPress={handlePlusPress} />

      {/* Main Feed Content */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={<ProfileHeader user={currentUser} />}
        ListEmptyComponent={
          loading ? (
            <LoadingState message="Fetching medical feed..." />
          ) : error ? (
            <ErrorState message={error} onRetry={loadData} />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
