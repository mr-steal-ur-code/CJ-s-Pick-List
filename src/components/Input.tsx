import ErrorMessage from "./ErrorMessage";

type InputProps = {
	name?: string;
	className?: string;
	type?: "password" | "text" | "tel" | "text" | "email";
	labelType?: "floating" | "stacked";
	labelText?: string;
	required?: boolean;
	disabled?: boolean;
	error?: string;
	onChange?: (value: any) => void;
	value?: string | number | undefined;
	defaultValue?: string | number | undefined;
	disableAutocomplete?: boolean;
	readonly?: boolean;
	minLength?: number;
};

const Input: React.FC<InputProps> = ({
	name,
	className,
	type,
	labelType,
	labelText,
	required,
	disabled,
	error,
	onChange,
	value,
	defaultValue,
	disableAutocomplete,
	readonly,
	minLength,
}) => {
	return (
		<>
			{error && <ErrorMessage className="mb-3" error={error} />}
			<div className={`relative z-0 ${labelType === "floating" && "pb-4"}`}>
				{labelType === "stacked" && (
					<label className="text-sm font-medium" htmlFor={name}>
						{labelText}
					</label>
				)}
				<input
					minLength={minLength || 0}
					readOnly={readonly}
					disabled={disabled}
					required={required}
					type={type || "text"}
					id={name}
					onChange={(e) => onChange && onChange(e)}
					name={name}
					value={value}
					defaultValue={defaultValue}
					autoComplete={disableAutocomplete ? "off" : "on"}
					className={`${
						error
							? "border-2 border-danger"
							: "border-0 border-b-2 border-tertiary"
					} ${className} text-xl block pt-1 my-2 px-0 w-full bg-transparent appearance-none focus:outline-hidden focus:ring-0 focus:border-primary peer transition-colors duration-300`}
					placeholder=" "
				/>

				{labelType === "floating" && (
					<label
						htmlFor={name}
						className="opacity:100 absolute text-xl duration-500 transform -translate-y-6 scale-75 top-0 z-50 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:opacity-60 peer-placeholder-shown:translate-y-0 peer-focus:opacity-100 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto"
					>
						{labelText}
					</label>
				)}
			</div>
		</>
	);
};

export default Input;
