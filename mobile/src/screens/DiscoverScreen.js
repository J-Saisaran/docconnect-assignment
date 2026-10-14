import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../constants/theme';
import { UserListItem } from '../components/UserListItem';
import { DiscoverIcon, BackArrowIcon } from '../components/SvgIcons';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { fetchUsers, sendConnectRequest } from '../services/api';

export const DiscoverScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
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
      setError(err.message || 'Failed to load profiles.');
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Top Search Header matching Discover - search.png */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Home')}
          accessibilityLabel="Back to Home"
        >
          <BackArrowIcon size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <DiscoverIcon size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search profiles, organizations..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Subtitle: "X profile matches" matching Discover - search.png */}
      <View style={styles.matchCountContainer}>
        <Text style={styles.matchCountText}>
          {filteredUsers.length} profile {filteredUsers.length === 1 ? 'match' : 'matches'}
        </Text>
      </View>
      <View style={styles.headerDivider} />

      {/* Vertical List of People matching Discover - search.png */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <UserListItem user={item} onConnect={handleConnect} />
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
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
  matchCountContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  matchCountText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
  },
  headerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 6,
  },
  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 86, // Align separator with text, past avatar
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
