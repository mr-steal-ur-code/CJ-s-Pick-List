import { useNavigate } from "react-router-dom";

type ButtonProps = {
	text?: string;
	textSize?: "sm" | "md" | "lg" | "xl";
	className?: string;
	type?: "cancel" | "reset" | "outline" | "text";
	submit?: boolean;
	loading?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	ariaLabel?: string;
	color?:
		| "text-success"
		| "text-[rgb(var(--color-danger))]"
		| "text-warning"
		| "text-primary"
		| "text-[rgb(var(--color-secondary))]"
		| "text-tertiary";
	animation?:
		| "animate-spin"
		| "animate-none "
		| "animate-ping"
		| "animate-pulse"
		| "animate-bounce";

	href?: string;
	navigateOptions?: {
		replace?: boolean;
		state?: any;
	};
};

const Button: React.FC<ButtonProps> = ({
	text,
	textSize,
	className,
	type,
	submit,
	loading,
	disabled,
	onClick,
	ariaLabel,
	color,
	animation,
	href,
	navigateOptions,
}) => {
	const navigate = useNavigate();
	let buttonClass: string;
	const commonClasses = `${className ? className : ""} ${
		textSize === "sm"
			? "text-sm"
			: textSize === "md"
			? "text-lg"
			: textSize === "lg"
			? "text-2xl"
			: textSize === "xl"
			? "text-4xl"
			: "text-md"
	} ${
		disabled
			? "opacity-40 p-2 cursor-not-allowed"
			: type !== "text"
			? "hover:opacity-70 active:opacity-20 p-2 cursor-pointer"
			: "hover:opacity-70 active:opacity-20 cursor-pointer"
	} ${color ?? ""} min-w-28 rounded-md transition-all duration-300`;

	switch (type) {
		case "cancel":
			buttonClass = `${commonClasses} border-3 border-[rgb(var(--color-danger))]`;
			break;
		case "reset":
			buttonClass = `${commonClasses} border-3 border-${
				color ? color.split("-")[1] : "primary"
			}`;
			break;
		case "outline":
			buttonClass = `${commonClasses} border-3 border-${
				color ? color.split("-")[1] : "primary"
			}`;
			break;
		case "text":
			buttonClass = commonClasses;
			break;
		default:
			buttonClass = `bg-primary ${commonClasses}`;
			break;
	}

	const handleClick = () => {
		if (disabled || loading) return;

		let handled = false;

		if (href && !handled) {
			handled = true;
			navigate(href, navigateOptions);
		}

		if (onClick && !handled) {
			handled = true;
			onClick();
		} else if (onClick && handled) {
			setTimeout(() => onClick(), 50);
		}
	};

	return (
		<button
			type={submit ? "submit" : "button"}
			disabled={disabled}
			aria-label={ariaLabel}
			className={buttonClass}
			onClick={handleClick}
		>
			<div className="flex justify-center gap-2 mx-auto">
				{loading && (
					<img
						className={`${animation || "animate-spin"}`}
						src="/assets/svg/spinner.svg"
						alt="load"
						width={30}
						height={30}
					/>
				)}
				{text || "Submit"}
			</div>
		</button>
	);
};

export default Button;
