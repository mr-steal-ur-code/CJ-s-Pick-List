type LoaderProps = {
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};

const Loader: React.FC<LoaderProps> = ({ size = "sm" }) => {
	const sizeClasses = {
		xs: "h-8 w-8",
		sm: "h-16 w-16",
		md: "h-40 w-40",
		lg: "h-52 w-52",
		xl: "h-72 w-72",
		xxl: "h-96 w-96",
	};
	const sizeClass = sizeClasses[size];
	return (
		<div className="flex justify-center items-center">
			<div
				className={`${sizeClass} animate-spin rounded-full border-t-2 border-b-2 border-primary`}
			/>
		</div>
	);
};

export default Loader;
