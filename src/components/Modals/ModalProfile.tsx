import PhotoCropper from "../PhotoCropper";
import { useAuth } from "../../context/AuthContext";
import { lazy, useRef } from "react";
import Button from "../Button";
import toast from "react-hot-toast";
import isAllowedShare from "../../utils/isAllowedShare";
import dateFromTimestamp from "../../utils/dateFromTimestamp";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();
	const { isLoggedIn, signout, clearAndSyncCache } = useAuth();

	const handleSync = async () => {
		const syncRes = await clearAndSyncCache();
		if (syncRes?.success) toast.success("Data Synced");
	};

	const handleSignout = async () => {
		if (!confirm("Sign out?")) return;
		await signout();
		navigate("/");
		modalRef?.current?.dismiss();
	};

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
							onClick={handleSignout}
						>
							Sign Out
						</p>
						{user?.createdAt && (
							<p>Account Created on {dateFromTimestamp(user?.createdAt)}</p>
						)}
						<p>
							<Button
								type="text"
								text="Reset Password"
								href="/recover-password"
								onClick={() => modalRef?.current?.dismiss()}
							/>
						</p>
						<PhotoCropper
							user={user}
							onClose={() => modalRef?.current?.dismiss()}
						/>
					</div>
				) : (
					<div className="text-center">
						<Button
							color="text-primary"
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
