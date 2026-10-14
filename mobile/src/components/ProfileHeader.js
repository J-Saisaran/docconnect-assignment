import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { resolveImageSource } from '../constants/assetsMap';
import { ConnectsBadgeIcon } from './SvgIcons';

export const ProfileHeader = ({ user }) => {
  const name = user?.name || 'Dr. Arjun Mehta';
  const occupation = user?.occupation || 'Cardiology';
  const connectsCount = user?.connectsCount || 2;
  const imageSource = resolveImageSource(user?.profileImage || '/assets/Profile image/Image-3.png');

  return (
    <View style={styles.container}>
      {/* Centered Large Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={imageSource} style={styles.avatar} resizeMode="contain" />
      </View>

      {/* Connects Pill */}
      <View style={styles.connectsPill}>
        <ConnectsBadgeIcon size={14} color={COLORS.primaryDark} />
        <Text style={styles.connectsText}>{connectsCount} Connects</Text>
      </View>

      {/* Name and Specialty */}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.occupation}>{occupation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: 76,
    height: 76,
  },
  connectsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4EBEB',
    marginBottom: 10,
    gap: 6,
  },
  connectsText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.primaryDark,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  occupation: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
