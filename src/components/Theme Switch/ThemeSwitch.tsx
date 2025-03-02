import { FaSun } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeContext";
import { IoMoonSharp } from "react-icons/io5";
import "./theme.css";

const ThemeSwitch: React.FC = () => {
	const { toggleTheme, theme } = useTheme();
	return (
		<div
			className={`${theme === "dark" ? "dark" : "light"} toggle-container`}
			onClick={toggleTheme}
		>
			<div className="icon-container">
				{theme === "dark" ? <IoMoonSharp /> : <FaSun />}
			</div>
		</div>
	);
};

export default ThemeSwitch;
