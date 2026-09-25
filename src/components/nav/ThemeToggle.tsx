import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../slices/themeSlice';
import { Moon, Sun } from 'lucide-react';

// 1. Define an explicit interface for the component props
interface ThemeToggleProps {
  theme?: 'light' | 'dark'; // Restricts the theme prop strictly to these two values
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme = 'light' }) => {
  const dispatch = useDispatch();

  const handleToggleTheme = () => dispatch(toggleTheme());

  return (
    <div className='flex items-center justify-center bg-transparent rounded-full'>
      <button 
        onClick={handleToggleTheme} 
        className={`p-2 rounded-full transition ${
          theme === 'light' 
            ? 'bg-white text-orange-600 hover:bg-orange-100' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
        }`}
      >
        {theme === 'light' ? (
          <Moon size={18} className='flex items-center justify-center' />
        ) : (
          <Sun size={18} />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;