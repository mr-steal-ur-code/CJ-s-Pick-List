import { Suspense } from "react";
import Loader from "./Loader";

type SuspenseProps = {
	children: React.ReactNode;
};

const SuspenseLoader: React.FC<SuspenseProps> = ({ children }) => {
	return (
		<Suspense
			fallback={
				<div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
					<Loader size="xl" />
				</div>
			}
		>
			{children}
		</Suspense>
	);
};

export default SuspenseLoader;
