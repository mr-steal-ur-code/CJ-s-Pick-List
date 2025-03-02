import SuspenseLoader from "./SuspenseLoader";
import { formatTimestamp } from "../utils/formatTimestamp";
import PhotoCropper from "./PhotoCropper";
import { useAuth } from "../context/AuthContext";
import { lazy, useRef } from "react";
import { Link } from "react-router-dom";

type ModalProfileProps = {
	isOpen: boolean;
	onClose: () => void;
	user: User;
};
const Modal = lazy(() => import("./Modal"));
const ModalProfile: React.FC<ModalProfileProps> = ({
	isOpen,
	onClose,
	user,
}) => {
	const modalRef = useRef<ModalHandle>(null);
	const { isLoggedIn, signout } = useAuth();

	return (
		<SuspenseLoader>
			<Modal closeButton ref={modalRef} isOpen={isOpen} onClose={onClose}>
				<div className="py-2">
					{isLoggedIn ? (
						<div className="flex flex-col gap-6">
							<p
								className="self-end cursor-pointer font-semibold hover:text-primary"
								onClick={() => {
									if (!confirm("Sign out?")) return;
									signout();
								}}
							>
								Sign Out
							</p>
							<p>
								Account Created on{" "}
								{formatTimestamp(user?.createdAt, "shortDate")}
							</p>
							<PhotoCropper
								user={user}
								onClose={() => modalRef?.current?.dismiss()}
							/>
						</div>
					) : (
						<>
							<Link
								className="border-b-2 hover:text-primary hover:border-b-primary transition-colors duration-300"
								to="/sign-in"
								onClick={() => modalRef?.current?.dismiss()}
							>
								Sign-In
							</Link>
							<span> to access your account</span>
						</>
					)}
				</div>
			</Modal>
		</SuspenseLoader>
	);
};

export default ModalProfile;
