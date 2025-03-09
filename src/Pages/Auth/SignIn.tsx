import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
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
		setError("");
		if (!email || !password) return;
		const res = await emailAndPasswordSignIn(email, password);
		if (!res.success) {
			setError(res.response);
		}
	};

	return (
		<>
			<div className="fade-in p-4 flex flex-col gap-8">
				<h2 className="text-center pb-4 font-bold">Sign In</h2>
				<form className="flex flex-col" onSubmit={(e) => handleSignIn(e)}>
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
					<div className="flex justify-end">
						<Button
							color="text-[rgb(var(--color-secondary))]"
							type="text"
							text="Forgot Password?"
							href="/recover-password"
						/>
					</div>
					<div className="flex flex-col gap-5 items-center mt-4">
						<Button
							type="outline"
							submit
							className="font-bold text-lg"
							text="Sign In"
						/>

						<p>or</p>
						<Button
							text="Sign Up"
							color="text-primary"
							type="text"
							href="/register"
						/>
					</div>
				</form>
			</div>
		</>
	);
};
export default SignIn;
