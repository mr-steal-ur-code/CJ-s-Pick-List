type ErrorMessageProps = {
	error: string | undefined;
	position?: "left" | "right" | "center";
	inline?: boolean;
	className?: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
	error,
	position,
	inline,
	className,
}) => {
	return (
		<p
			className={`${className} text-danger font-semibold text-xl ${
				inline ? "inline-block" : ""
			} ${position ? position : "text-left"}`}
		>
			{error || ""}
		</p>
	);
};

export default ErrorMessage;
