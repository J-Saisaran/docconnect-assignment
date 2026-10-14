import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { resolveImageSource } from '../constants/assetsMap';
import { ConnectsBadgeIcon, AddUserIcon } from './SvgIcons';

export const UserCard = ({ user, onConnect, onCancelRequest, onUndoConnect }) => {
  const [connecting, setConnecting] = useState(false);
  const isRequested = user?.isRequested;

  const name = user?.name || 'Dr. Arjun Mehta';
  const occupation = user?.occupation || 'Cardiology';
  const connectsCount = user?.connectsCount || 2;
  const avatarSource = resolveImageSource(user?.profileImage);

  const handleCancel = onCancelRequest || onUndoConnect;

  const handlePress = async () => {
    if (connecting) return;

    if (isRequested) {
      if (handleCancel) {
        Alert.alert(
          'Cancel Request?',
          `Are you sure you want to cancel the connection request to ${name}?`,
          [
            { text: 'Keep Request', style: 'cancel' },
            {
              text: 'Cancel Request',
              style: 'destructive',
              onPress: () => handleCancel(user._id),
            },
          ]
        );
      }
      return;
    }

    setConnecting(true);
    try {
      await onConnect(user._id);
    } catch (err) {
      console.warn('Connect failed:', err);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Badge: 2 Connects */}
      <View style={styles.badgePill}>
        <ConnectsBadgeIcon size={12} color={COLORS.primaryDark} />
        <Text style={styles.badgeText}>{connectsCount} Connects</Text>
      </View>

      {/* Profile Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="contain" />
      </View>

      {/* Name & Role */}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.occupation} numberOfLines={1}>
        {occupation}
      </Text>

      {/* Action Button: Connect or Requested */}
      <TouchableOpacity
        style={[
          styles.button,
          isRequested ? styles.buttonRequested : styles.buttonConnect,
        ]}
        activeOpacity={0.8}
        disabled={connecting}
        onPress={handlePress}
      >

        {connecting ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : isRequested ? (
          <Text style={styles.textRequested}>Requested</Text>
        ) : (
          <View style={styles.buttonInner}>
            <AddUserIcon size={16} color={COLORS.white} />
            <Text style={styles.textConnect}>Connect</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    margin: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    marginBottom: 10,
    alignSelf: 'center',
  },
  badgeText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.primaryDark,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  avatar: {
    width: 52,
    height: 52,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: '100%',
  },
  occupation: {
    fontFamily: FONTS.regular,
    fontSize: 12.5,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
    maxWidth: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonConnect: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonRequested: {
    backgroundColor: COLORS.requestedBg,
    borderWidth: 1.5,
    borderColor: COLORS.requestedBorder,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  textConnect: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.white,
  },
  textRequested: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.requestedText,
  },
});
