import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { resolveImageSource } from '../constants/assetsMap';
import { HeartIcon, SendIcon } from './SvgIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likesCount ?? 5);

  const author = post?.author;
  const authorName = author?.name || 'Docconnect';
  const authorRole = author?.occupation || 'Healthcare Technology';
  const authorAvatar = resolveImageSource(
    author?.profileImage || '/assets/Profile image/Image-1.png'
  );
  const postImage = post?.image ? resolveImageSource(post.image) : null;
  const isMultiImage = post?.carouselImages && post.carouselImages.length > 1;

  const handleLikeToggle = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikesCount((count) => (next ? count + 1 : count - 1));
      return next;
    });
  };

  return (
    <View style={styles.cardContainer}>
      {/* Author Header */}
      <View style={styles.authorRow}>
        <View style={styles.avatarContainer}>
          <Image source={authorAvatar} style={styles.authorAvatar} resizeMode="contain" />
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.authorRole}>{authorRole}</Text>
        </View>
      </View>

      {/* Post Text Content */}
      <Text style={styles.postContent}>{post?.content}</Text>

      {/* Post Media */}
      {postImage && (
        <View style={styles.imageContainer}>
          <Image source={postImage} style={styles.postImage} resizeMode="cover" />

          {/* Carousel Badge (1/2) if multi-image */}
          {isMultiImage && (
            <View style={styles.carouselBadge}>
              <Text style={styles.carouselBadgeText}>1/2</Text>
            </View>
          )}
        </View>
      )}

      {/* Post Action Footer */}
      <View style={styles.actionsRow}>
        {/* Like Button */}
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={handleLikeToggle}
        >
          <HeartIcon size={22} color={liked ? '#EF4444' : COLORS.textSecondary} filled={liked} />
          <Text style={[styles.actionCount, liked && { color: '#EF4444' }]}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        {/* Share / Send Button */}
        <View style={styles.actionButton}>
          <SendIcon size={22} color={COLORS.textSecondary} />
          <Text style={styles.actionCount}>{post?.sharesCount ?? 3}</Text>
        </View>
      </View>

      {/* Post Divider */}
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    paddingTop: 16,
    paddingBottom: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  authorAvatar: {
    width: 44,
    height: 44,
  },
  authorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  authorName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  authorRole: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  postContent: {
    fontFamily: FONTS.regular,
    fontSize: 14.5,
    color: COLORS.textPrimary,
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 420,
    backgroundColor: COLORS.surfaceWarm,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  carouselBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(41, 41, 43, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  carouselBadgeText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.backgroundLight,
    marginTop: 4,
  },
});
