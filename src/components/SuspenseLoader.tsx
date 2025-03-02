import { Suspense } from "react";
import Loader from "./Loader";

type SuspenseProps = {
	children: React.ReactNode;
};

const SuspenseLoader: React.FC<SuspenseProps> = ({ children }) => {
	return (
		<Suspense
			fallback={
				<div className="fixed top-[40vh] left-[50vw]">
					<Loader />
				</div>
			}
		>
			{children}
		</Suspense>
	);
};

export default SuspenseLoader;
