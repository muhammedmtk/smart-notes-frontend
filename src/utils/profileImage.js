const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(
  /\/api\/?$/,
  ''
);

export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return null;
  if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
    return profileImage;
  }
  const path = profileImage.startsWith('/') ? profileImage : `/${profileImage}`;
  return `${SERVER_URL}${path}`;
};

export const getInitials = (name) => name?.charAt(0).toUpperCase() || 'U';
