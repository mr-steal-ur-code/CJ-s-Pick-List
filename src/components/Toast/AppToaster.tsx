import toast, { ToastBar, Toaster } from "react-hot-toast";

type ToastProps = {
	gutter?: number;
	duration?: number;
	reverse?: boolean;
	position?:
		| "top-left"
		| "top-center"
		| "top-right"
		| "bottom-left"
		| "bottom-center"
		| "bottom-right";
};

const AppToaster: React.FC<ToastProps> = ({
	gutter,
	reverse,
	position,
	duration,
}) => {
	return (
		<Toaster
			reverseOrder={reverse || false}
			position={position || "bottom-center"}
			gutter={gutter || 20}
			containerStyle={{
				top: 100,
				left: 40,
				bottom: 220,
				right: 40,
			}}
			toastOptions={{
				success: {
					duration: duration || 3000,
					style: {
						border: "5px solid green",
						color: "#222",
						fontWeight: "500",
					},
				},
				error: {
					duration: 10000,
					style: {
						border: "5px solid red",
						color: "red",
						fontWeight: "500",
					},
				},
				loading: {
					style: {
						border: "5px solid blue",
						color: "#222",
						fontWeight: "500",
					},
				},
			}}
		>
			{(t) => (
				<ToastBar style={{ minWidth: "280px", position: "relative" }} toast={t}>
					{({ icon, message }) => (
						<>
							{icon}
							{message}
							{t.type === "error" && (
								<div
									className="text-sm absolute top-2 right-2 cursor-pointer"
									onClick={() => toast.dismiss(t.id)}
								>
									<svg viewBox="0 0 40 40" width="20" height="20">
										<path
											d="M 10,10 L 30,30 M 30,10 L 10,30"
											stroke="currentColor"
											strokeWidth="5"
											fill="none"
										/>
									</svg>
								</div>
							)}
						</>
					)}
				</ToastBar>
			)}
		</Toaster>
	);
};

export default AppToaster;
