import { formatTimestamp } from "../../utils/formatTimestamp";
import PhotoCropper from "../PhotoCropper";
import { useAuth } from "../../context/AuthContext";
import { lazy, useRef } from "react";
import Button from "../Button";

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
	const { isLoggedIn, signout, clearAndSyncCache } = useAuth();

	return (
		<Modal
			ref={modalRef}
			isOpen={isOpen}
			footerLeftBtn={
				<Button text="Sync State" type="cancel" onClick={clearAndSyncCache} />
			}
			onClose={onClose}
		>
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
							Account Created on {formatTimestamp(user?.createdAt, "shortDate")}
						</p>
						<PhotoCropper
							user={user}
							onClose={() => modalRef?.current?.dismiss()}
						/>
					</div>
				) : (
					<div className="text-center">
						<Button
							type="text"
							text="Sign In"
							href="/sign-in"
							onClick={() => modalRef?.current?.dismiss()}
						/>
						<span className="block"> to access your account</span>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ModalProfile;
