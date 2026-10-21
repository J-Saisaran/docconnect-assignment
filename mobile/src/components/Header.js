import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { PlusIcon } from './SvgIcons';

const LOGO_IMAGE = require('../../assets/assignment/docconnect-logo.png');

export const Header = ({ onPlusPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <View style={styles.contentRow}>
        <View style={styles.logoRow}>
          <Image
            source={LOGO_IMAGE}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="DocConnect"
          />
        </View>

        <TouchableOpacity
          style={styles.plusButton}
          activeOpacity={0.8}
          onPress={onPlusPress}
          accessibilityLabel="Create Post"
        >
          <PlusIcon size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoImage: {
    width: 156,
    height: 22,
  },
  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});
