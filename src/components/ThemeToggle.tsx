import useTheme from '../hooks/useTheme';
import './ThemeToggle.scss';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={`ThemeToggle ThemeToggle--${theme}`} 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '☽' : '☀'}
    </button>
  );
};

export default ThemeToggle;