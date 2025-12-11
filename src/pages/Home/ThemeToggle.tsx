import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="flex items-center gap-2" onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon size={22} />
      ) : (
        <Sun size={22} />
      )}
    </button>
  );
};

export default ThemeToggleButton;
