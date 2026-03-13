export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export const getCategoryIcon = (category) => {
  const icons = {
    water: '💧',
    roads: '🛣️',
    waste: '🗑️',
    electricity: '⚡',
    safety: '🚨',
    education: '📚',
    other: '📋'
  };
  return icons[category] || '📋';
};
