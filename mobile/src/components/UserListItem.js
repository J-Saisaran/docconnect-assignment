import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { resolveImageSource } from '../constants/assetsMap';
import { AddUserIcon, LocationPinIcon } from './SvgIcons';

export const UserListItem = ({ user, onConnect, onCancelRequest, onUndoConnect }) => {
  const [connecting, setConnecting] = useState(false);
  const isRequested = user?.isRequested;

  const name = user?.name || 'Dr. Arjun Mehta';
  const occupation = user?.occupation || 'Cardiology';
  const location = user?.location || 'Chennai, Tamil Nadu';
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
    <View style={styles.container}>
      {/* Left: Circular Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="contain" />
      </View>

      {/* Middle: Name, Occupation, Location */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.occupation} numberOfLines={1}>
          {occupation}
        </Text>
        <View style={styles.locationRow}>
          <LocationPinIcon size={14} color={COLORS.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>

      {/* Right: Connect / Requested Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          isRequested ? styles.requestedButton : styles.connectButton,
        ]}
        activeOpacity={0.7}
        disabled={connecting}
        onPress={handlePress}
      >

        {connecting ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : isRequested ? (
          <Text style={styles.requestedText}>Requested</Text>
        ) : (
          <View style={styles.connectInner}>
            <AddUserIcon size={20} color={COLORS.textPrimary} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  occupation: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  connectInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestedButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.requestedBg,
    borderWidth: 1.5,
    borderColor: COLORS.requestedBorder,
  },
  requestedText: {
    fontFamily: FONTS.bold,
    fontSize: 12.5,
    color: COLORS.requestedText,
  },
});
