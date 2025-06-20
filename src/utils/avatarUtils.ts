
// Utility functions for generating random avatars

export const generateRandomAvatar = (name: string, type: 'agent' | 'contact' = 'agent') => {
  // Use DiceBear API for consistent random avatars based on name
  const seed = name.toLowerCase().replace(/\s+/g, '');
  
  if (type === 'agent') {
    // Use professional-looking avatars for agents
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;
  } else {
    // Use more diverse avatars for contacts
    return `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;
  }
};

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};
