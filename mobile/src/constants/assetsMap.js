// Local asset maps ensuring images display instantly and gracefully fall back

export const LOCAL_IMAGES = {
  // Profile Images
  '/assets/Profile image/Image.png': require('../../assets/assignment/Profile image/Image.png'),
  '/assets/Profile image/Image-1.png': require('../../assets/assignment/Profile image/Image-1.png'),
  '/assets/Profile image/Image-2.png': require('../../assets/assignment/Profile image/Image-2.png'),
  '/assets/Profile image/Image-3.png': require('../../assets/assignment/Profile image/Image-3.png'),
  '/assets/Profile image/Image-4.png': require('../../assets/assignment/Profile image/Image-4.png'),

  // Post Images
  '/assets/Post image/create-post-image-1@2x.png': require('../../assets/assignment/Post image/create-post-image-1.png'),
  '/assets/Post image/create-post-image-2@2x.png': require('../../assets/assignment/Post image/create-post-image-2.png'),
  '/assets/Post image/create-post-image-3@2x.png': require('../../assets/assignment/Post image/create-post-image-3.png'),
  '/assets/Post image/create-post-image-4@2x.png': require('../../assets/assignment/Post image/create-post-image-4.png'),
  '/assets/Post image/create-post-image-5@2x.png': require('../../assets/assignment/Post image/create-post-image-5.png'),

  '/assets/Post image/create-post-image-1.png': require('../../assets/assignment/Post image/create-post-image-1.png'),
  '/assets/Post image/create-post-image-2.png': require('../../assets/assignment/Post image/create-post-image-2.png'),
  '/assets/Post image/create-post-image-3.png': require('../../assets/assignment/Post image/create-post-image-3.png'),
  '/assets/Post image/create-post-image-4.png': require('../../assets/assignment/Post image/create-post-image-4.png'),
  '/assets/Post image/create-post-image-5.png': require('../../assets/assignment/Post image/create-post-image-5.png'),
};

/**
 * Resolves an image source - returns either local bundled asset or remote URI
 */
export const resolveImageSource = (imagePath, baseUrl = '') => {
  if (!imagePath) {
    return require('../../assets/assignment/Profile image/Image.png');
  }

  // If already mapped locally, prefer local bundled asset for zero-latency instant rendering
  if (LOCAL_IMAGES[imagePath]) {
    return LOCAL_IMAGES[imagePath];
  }

  // If remote absolute URL (e.g. http://...)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return { uri: imagePath };
  }

  // Construct full URL with baseUrl
  const fullUrl = baseUrl ? `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}` : imagePath;
  return { uri: fullUrl };
};
