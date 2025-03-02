import { createContext, useContext, useEffect, useState } from "react";
import isDarkMode from "../utils/isDarkMode";

type ThemeContextType = {
	toggleTheme: () => void;
	theme: string;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: "",
	toggleTheme: () => {},
});

export const ThemeContextProvider = ({ children }) => {
	const currentTheme = isDarkMode() ? "dark" : "light";
	const [theme, setTheme] = useState(currentTheme);
	const toggleTheme = () => {
		const newTheme = currentTheme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		localStorage.setItem("cloud-cookbook-theme", newTheme);
	};

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ toggleTheme, theme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
