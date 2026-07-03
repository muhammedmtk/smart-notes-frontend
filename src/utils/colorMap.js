export const colorMap = {
  yellow: {
    bg: '!bg-yellow-100 dark:!bg-yellow-900/30',
    border: 'border-yellow-400',
    ring: 'ring-yellow-400',
    text: 'text-yellow-800 dark:text-yellow-200',
    swatch: 'bg-yellow-400',
    hex: '#fef3c7',
  },
  green: {
    bg: '!bg-green-100 dark:!bg-green-900/30',
    border: 'border-green-400',
    ring: 'ring-green-400',
    text: 'text-green-800 dark:text-green-200',
    swatch: 'bg-green-400',
    hex: '#d1fae5',
  },
  blue: {
    bg: '!bg-blue-100 dark:!bg-blue-900/30',
    border: 'border-blue-400',
    ring: 'ring-blue-400',
    text: 'text-blue-800 dark:text-blue-200',
    swatch: 'bg-blue-400',
    hex: '#dbeafe',
  },
  pink: {
    bg: '!bg-pink-100 dark:!bg-pink-900/30',
    border: 'border-pink-400',
    ring: 'ring-pink-400',
    text: 'text-pink-800 dark:text-pink-200',
    swatch: 'bg-pink-400',
    hex: '#fce7f3',
  },
  purple: {
    bg: '!bg-purple-100 dark:!bg-purple-900/30',
    border: 'border-purple-400',
    ring: 'ring-purple-400',
    text: 'text-purple-800 dark:text-purple-200',
    swatch: 'bg-purple-400',
    hex: '#f3e8ff',
  },
  orange: {
    bg: '!bg-orange-100 dark:!bg-orange-900/30',
    border: 'border-orange-400',
    ring: 'ring-orange-400',
    text: 'text-orange-800 dark:text-orange-200',
    swatch: 'bg-orange-400',
    hex: '#ffedd5',
  },
};

export const COLOR_OPTIONS = Object.keys(colorMap);

export const getColorClasses = (colorName) => colorMap[colorName] || colorMap.yellow;
