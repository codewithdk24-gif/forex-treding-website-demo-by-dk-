export const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.className = savedTheme;
  return savedTheme;
};

export const toggleTheme = () => {
  const currentTheme = document.documentElement.className;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.className = newTheme;
  localStorage.setItem('theme', newTheme);
  
  // Dispatch custom event for chart synchronization
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
  
  return newTheme;
};

export const getTheme = () => document.documentElement.className;
