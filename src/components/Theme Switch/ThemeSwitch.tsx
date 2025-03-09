import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./theme.css";

const ThemeSwitch: React.FC = () => {
	const { toggleTheme, theme } = useTheme();
	return (
		<div
			className={`${theme === "dark" ? "dark" : "light"} toggle-container`}
			onClick={toggleTheme}
		>
			<div className="icon-container">
				{theme === "dark" ? <Moon /> : <Sun />}
			</div>
		</div>
	);
};

export default ThemeSwitch;
