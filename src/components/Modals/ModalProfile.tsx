import PhotoCropper from "../PhotoCropper";
import { useAuth } from "../../context/AuthContext";
import { lazy, useRef } from "react";
import Button from "../Button";
import toast from "react-hot-toast";
import isAllowedShare from "../../utils/isAllowedShare";
import dateFromTimestamp from "../../utils/dateFromTimestamp";

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

	const handleSync = async () => {
		const syncRes = await clearAndSyncCache();
		if (syncRes?.success) toast.success("Data Synced");
	};

	console.log(typeof user?.createdAt, user?.createdAt);

	return (
		<Modal
			ref={modalRef}
			isOpen={isOpen}
			footerLeftBtn={
				isAllowedShare(user?.id) && (
					<Button text="Sync Data" type="cancel" onClick={handleSync} />
				)
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
						<p>Account Created on {dateFromTimestamp(user?.createdAt)}</p>
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
