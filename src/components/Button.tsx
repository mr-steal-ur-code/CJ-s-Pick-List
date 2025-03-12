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
			? "opacity-40"
			: type && type !== "text"
			? "hover:bg-[rgb(var(--color-hover-bkg))] active:bg-transparent hover:opacity-70 active:opacity-20"
			: "hover:opacity-70 active:opacity-20"
	}  ${
		color ? color : ""
	} p-2 min-w-28 rounded-md cursor-pointer transition-all duration-300`;

	switch (type) {
		case "cancel":
			buttonClass = `${commonClasses} outline outline-[rgb(var(--color-danger))] outline-3`;
			break;
		case "reset":
			buttonClass = `${commonClasses} outline outline-tertiary outline-3`;
			break;
		case "outline":
			buttonClass = `${commonClasses} outline outline-primary outline-3`;
			break;
		case "text":
			buttonClass = commonClasses;
			break;
		default:
			buttonClass = `bg-primary text-white ${commonClasses} `;
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
