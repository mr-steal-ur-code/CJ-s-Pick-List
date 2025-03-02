import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<AuthContextProvider>
		<ThemeContextProvider>
			<Router />
		</ThemeContextProvider>
	</AuthContextProvider>
);
