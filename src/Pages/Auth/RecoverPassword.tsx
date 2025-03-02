import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ErrorMessage from "../../components/ErrorMessage";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const RecoverPassword: React.FC = () => {
	document.title = "Recover Password";
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const { passwordReset } = useAuth();
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handlePasswordReset = async () => {
		if (!email.trim()) {
			return setMessage(
				"Please provide the email address associated with the account."
			);
		} else if (!emailRegex.test(email))
			return setMessage("Email address not valid");
		const res = await passwordReset(email);
		setMessage(res?.response);
	};

	return (
		<div className="px-2">
			<Link className="text-sm align-middle hover:text-primary" to="/sign-in">
				<IoArrowBack className="inline-block" /> Back to sign in
			</Link>
			<div className="fade-in flex flex-col items-center gap-4 pt-12">
				<h4>Forgot your password?</h4>
				<p className="font-bold p-2">
					Enter the email address associated with your account and we'll send
					you instructions to reset it.
				</p>
				{message && <ErrorMessage className="pb-4" error={message} />}
				<div className="flex flex-row items-start gap-8">
					<Input
						type="email"
						name="email"
						labelText="email"
						labelType="floating"
						onChange={(e) => setEmail(e.target?.value)}
					/>
					<Button text="send" type="outline" onClick={handlePasswordReset} />
				</div>
			</div>
		</div>
	);
};

export default RecoverPassword;
