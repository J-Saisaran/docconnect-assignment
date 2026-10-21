import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { resolveImageSource } from '../constants/assetsMap';
import { HeartIcon, SendIcon } from './SvgIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likesCount ?? 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const author = post?.author;
  const authorName = author?.name || 'Docconnect';
  const authorRole = author?.occupation || 'Healthcare Technology';
  const authorAvatar = resolveImageSource(
    author?.profileImage || '/assets/Profile image/Image-1.png'
  );

  // Extract all carousel images, falling back to post.image if carouselImages is empty
  const mediaList =
    Array.isArray(post?.carouselImages) && post.carouselImages.length > 0
      ? post.carouselImages
      : post?.image
      ? [post.image]
      : [];

  const isMultiImage = mediaList.length > 1;

  const handleLikeToggle = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikesCount((count) => (next ? count + 1 : count - 1));
      return next;
    });
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < mediaList.length) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index) => {
    if (index >= 0 && index < mediaList.length) {
      scrollViewRef.current?.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true,
      });
      setActiveIndex(index);
    }
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

      {/* Post Media / Swipeable Carousel */}
      {mediaList.length > 0 && (
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            bounces={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScroll}
            style={styles.imageScroll}
          >
            {mediaList.map((item, index) => {
              const src = resolveImageSource(item);
              return (
                <View key={`${item}-${index}`} style={styles.imageSlide}>
                  <Image source={src} style={styles.postImage} resizeMode="cover" />
                </View>
              );
            })}
          </ScrollView>

          {/* Dynamic Carousel Badge (e.g. 1/2, 2/2) */}
          {isMultiImage && (
            <View style={styles.carouselBadge} pointerEvents="none">
              <Text style={styles.carouselBadgeText}>
                {activeIndex + 1}/{mediaList.length}
              </Text>
            </View>
          )}

          {/* Left Navigation Arrow */}
          {isMultiImage && activeIndex > 0 && (
            <TouchableOpacity
              style={[styles.arrowButton, styles.leftArrow]}
              onPress={() => scrollToIndex(activeIndex - 1)}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
          )}

          {/* Right Navigation Arrow */}
          {isMultiImage && activeIndex < mediaList.length - 1 && (
            <TouchableOpacity
              style={[styles.arrowButton, styles.rightArrow]}
              onPress={() => scrollToIndex(activeIndex + 1)}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          )}

          {/* Pagination Dots */}
          {isMultiImage && (
            <View style={styles.dotsContainer}>
              {mediaList.map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => scrollToIndex(idx)}
                  activeOpacity={0.8}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  style={[
                    styles.dot,
                    idx === activeIndex ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
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
    overflow: 'hidden',
  },
  imageScroll: {
    width: SCREEN_WIDTH,
    height: 420,
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    height: 420,
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 10,
  },
  carouselBadgeText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    zIndex: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    backgroundColor: COLORS.white,
    width: 16,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 6,
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(41, 41, 43, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  leftArrow: {
    left: 12,
  },
  rightArrow: {
    right: 12,
  },
  arrowText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2,
    textAlign: 'center',
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
