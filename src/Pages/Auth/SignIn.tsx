import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import ErrorMessage from "../../components/ErrorMessage";

const SignIn: React.FC = () => {
	document.title = "Sign-in";
	const { emailAndPasswordSignIn } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSignIn = async (event) => {
		event?.preventDefault();
		const res = await emailAndPasswordSignIn(email, password);
		if (!res.success) {
			setError(res.response);
		}
	};

	return (
		<>
			<div className="fade-in px-2">
				<h2 className="text-center pb-4 font-bold">Sign In</h2>
				<form onSubmit={(e) => handleSignIn(e)}>
					<Input
						required
						type="email"
						labelText="Email"
						labelType="floating"
						name="email"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						required
						labelText="Password"
						labelType="floating"
						name="password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error && <ErrorMessage error={error} />}
					<Link
						className="text-content hover:opacity-75 flex mb-6 float-right"
						to="/recover-password"
					>
						Forgot Password?
					</Link>
					<Button
						submit
						className="w-full font-bold text-lg bg-linear-to-r from-primaryGradient-0 to-primaryGradient-1"
						text="Sign In"
					/>
				</form>
				<div className="flex flex-col gap-5 items-center pt-16">
					<p>or </p>
					<Link
						className="text-content hover:opacity-75 text-lg"
						to="/register"
					>
						<span className="font-bold">SIGN UP</span>
					</Link>
				</div>
			</div>
		</>
	);
};

export default SignIn;
