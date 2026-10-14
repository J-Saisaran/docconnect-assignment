import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';
import { UserCard } from '../components/UserCard';
import { DiscoverIcon } from '../components/SvgIcons';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { fetchUsers, sendConnectRequest } from '../services/api';

export const DiscoverScreen = () => {
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error('DiscoverScreen load error:', err);
      setError(err.message || 'Failed to load discover profiles.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUsers();
  }, [loadUsers]);

  const handleConnect = async (userId) => {
    // Optimistically update UI immediately to 'isRequested: true'
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isRequested: true } : u))
    );

    try {
      await sendConnectRequest(userId);
    } catch (err) {
      console.error('Failed to send connect request:', err);
      // Revert if API fails
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isRequested: false } : u))
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(query);
    const roleMatch = u.occupation?.toLowerCase().includes(query);
    const locMatch = u.location?.toLowerCase().includes(query);
    return nameMatch || roleMatch || locMatch;
  });

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundLight} />

      {/* Top Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <DiscoverIcon size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search profiles, organizations..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>People you may know</Text>
      </View>

      {/* 2-Column Grid */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <UserCard user={item} onConnect={handleConnect} />
        )}
        ListEmptyComponent={
          loading ? (
            <LoadingState message="Finding medical professionals..." />
          ) : error ? (
            <ErrorState message={error} onRetry={loadUsers} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No matching profiles found.</Text>
            </View>
          )
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
        columnWrapperStyle={styles.columnWrapper}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEA',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textPrimary,
    height: '100%',
  },
  sectionHeader: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 24,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
