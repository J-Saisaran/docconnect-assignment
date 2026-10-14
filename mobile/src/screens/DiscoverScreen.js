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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../constants/theme';
import { UserCard } from '../components/UserCard';
import { UserListItem } from '../components/UserListItem';
import {
  DiscoverIcon,
  BackArrowIcon,
  RefreshIcon,
  GridIcon,
  ListIcon,
} from '../components/SvgIcons';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import {
  fetchUsers,
  sendConnectRequest,
  clearAllRequestedState,
  cancelConnectRequest,
} from '../services/api';

export const DiscoverScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // Default: 'grid' (cards)

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

  const handleCancelRequest = async (userId) => {
    // Optimistically update UI immediately to 'isRequested: false'
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isRequested: false } : u))
    );
    try {
      await cancelConnectRequest(userId);
    } catch (err) {
      console.error('Failed to cancel connect request:', err);
    }
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset All for Screen Recording?',
      'Revert all "Requested" buttons back to the "+" Add User icon?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to (+)',
          style: 'destructive',
          onPress: async () => {
            setUsers((prev) => prev.map((u) => ({ ...u, isRequested: false })));
            await clearAllRequestedState();
            Alert.alert('Reset Complete', 'All buttons are now back to the Add User (+) icon!');
          },
        },
      ]
    );
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(query);
    const roleMatch = u.occupation?.toLowerCase().includes(query);
    const locMatch = u.location?.toLowerCase().includes(query);
    return nameMatch || roleMatch || locMatch;
  });

  const isGrid = viewMode === 'grid';

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 16),
          backgroundColor: isGrid ? COLORS.backgroundLight : COLORS.white,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={isGrid ? COLORS.backgroundLight : COLORS.white} />

      {/* Top Search Header */}
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

      {/* Sub-header: Title, Toggle View, and Reload */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={handleResetAll}
          delayLongPress={700}
        >
          <Text style={styles.sectionTitle}>
            {isGrid
              ? 'People you may know'
              : `${filteredUsers.length} profile ${filteredUsers.length === 1 ? 'match' : 'matches'}`}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))}
            activeOpacity={0.7}
            accessibilityLabel={`Switch to ${isGrid ? 'List' : 'Grid'} view`}
          >
            {isGrid ? (
              <ListIcon size={18} color={COLORS.textSecondary} />
            ) : (
              <GridIcon size={18} color={COLORS.textSecondary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reloadButton}
            activeOpacity={0.7}
            onPress={onRefresh}
            accessibilityLabel="Reload profiles"
          >
            <RefreshIcon size={14} color={COLORS.primary} />
            <Text style={styles.reloadButtonText}>Reload</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerDivider} />

      {/* Profiles Feed: 2-Column Cards (default) or List */}
      <FlatList
        key={viewMode}
        data={filteredUsers}
        keyExtractor={(item) => item._id.toString()}
        numColumns={isGrid ? 2 : 1}
        renderItem={({ item }) =>
          isGrid ? (
            <UserCard
              user={item}
              onConnect={handleConnect}
              onCancelRequest={handleCancelRequest}
            />
          ) : (
            <UserListItem
              user={item}
              onConnect={handleConnect}
              onCancelRequest={handleCancelRequest}
            />
          )
        }
        columnWrapperStyle={isGrid ? styles.columnWrapper : undefined}
        ItemSeparatorComponent={
          !isGrid ? () => <View style={styles.itemSeparator} /> : null
        }
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
        contentContainerStyle={isGrid ? styles.gridContent : styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#EFEFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEA',
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
  sectionHeader: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EFEFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    gap: 4,
  },
  reloadButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.primary,
  },
  headerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 6,
  },
  gridContent: {
    paddingHorizontal: 10,
    paddingBottom: 32,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 32,
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 86,
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

