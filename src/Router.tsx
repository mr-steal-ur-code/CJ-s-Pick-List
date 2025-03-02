import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import RecoverPassword from "./Pages/Auth/RecoverPassword";
import Register from "./Pages/Auth/Register";
import NotFound from "./Pages/Not Found/NotFound";
import SignIn from "./Pages/Auth/SignIn";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";

const Router: React.FC = () => {
	const { isLoggedIn } = useAuth();

	return (
		<BrowserRouter>
			<Header />
			<div
				className={`mt-16 sm:max-w-[100vw] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1200px] mx-auto mb-20 py-7 flex flex-col min-h-[82vh]`}
			>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/sign-in"
						element={isLoggedIn ? <Navigate to="/" /> : <SignIn />}
					/>
					<Route path="/recover-password" element={<RecoverPassword />} />
					<Route path="/register" element={<Register />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
			{/* <Footer /> */}
		</BrowserRouter>
	);
};

export default Router;
