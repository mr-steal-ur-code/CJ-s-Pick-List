import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AppToaster from "../../components/Toast/AppToaster";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import bookStore from "../../store/userStore";

const Register: React.FC = () => {
	document.title = "Register";
	const { user } = bookStore();
	const {
		emailSignInCreate,
		emailVerified,
		sendVerificationEmail /*idToken*/,
	} = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleUserCreate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		const res = await emailSignInCreate(email, password);
		if (res.success) {
			setLoading(false);
			toast.success("Account created successfully", { duration: 2000 });
		} else {
			setLoading(false);
			setError(res.response);
		}
	};

	const handleEmailVerification = async () => {
		const emailRes = await sendVerificationEmail();
		if (emailRes?.success) {
			toast.success(emailRes?.response);
		} else toast.error(emailRes?.response);
	};

	return (
		<div className="fade-in">
			<AppToaster />
			{user?.id && !emailVerified ? (
				<div className="text-center">
					<p className="text-lg mt-8">
						We've sent a verification email to {user?.email}. Please check your
						inbox and click the link to continue. If you don't see the email,
						please check your spam folder. Once verified, please refresh this
						page.
					</p>
					<Button
						className="underline underline-offset-2"
						onClick={handleEmailVerification}
						text="Re-Send Email"
						type="text"
						textSize="lg"
						color="text-primary"
					/>
				</div>
			) : (
				<div className="px-2">
					<p className="pb-12 text-xl text-primary2">
						Please use a valid email when registering
					</p>
					<form onSubmit={(e) => handleUserCreate(e)}>
						<Input
							required
							name="email"
							disableAutocomplete
							type="email"
							labelText="E-mail"
							labelType="floating"
							onChange={(e) => setEmail(e?.target?.value)}
						/>
						<Input
							required
							name="password"
							disableAutocomplete
							type="password"
							labelText="Password"
							minLength={6}
							labelType="floating"
							onChange={(e) => setPassword(e?.target?.value)}
						/>
						{error && <ErrorMessage error={error} />}
						<Button
							submit
							loading={loading}
							disabled={loading || !email.length || !password.length}
							className="w-full mt-2"
							text="Create account"
						/>
					</form>
					<div className="text-center">
						<span className="p-4 block"> Already have an account? </span>
						<Link className="hover:opacity-70 text-center" to="/sign-in">
							Sign In
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default Register;
