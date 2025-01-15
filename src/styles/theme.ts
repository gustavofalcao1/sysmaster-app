export const lightTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#4f46e5',
    background: {
      main: '#f9fafb',
      paper: '#ffffff',
      sidebar: '#1E1E2D',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      light: '#9ca3af',
    },
    border: '#e5e7eb',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#818cf8',
    secondary: '#6366f1',
    background: {
      main: '#111827',
      paper: '#1f2937',
      sidebar: '#0f172a',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#e5e7eb',
      light: '#9ca3af',
    },
    border: '#374151',
    error: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
  },
};
