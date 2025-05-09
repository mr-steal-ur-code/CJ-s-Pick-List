import AddItem from "../AddItem";
import { lazy, useRef } from "react";
import SuspenseLoader from "../SuspenseLoader";

type ModalItemAddProps = {
	isOpen: boolean;
	onClose: () => void;
};
const Modal = lazy(() => import("./Modal"));
const ModalProfile: React.FC<ModalItemAddProps> = ({ isOpen, onClose }) => {
	const modalRef = useRef(null);
	const handleSubmit = () => {
		if (onClose) modalRef?.current?.dismiss();
	};
	return (
		<>
			{isOpen && (
				<SuspenseLoader>
					<Modal ref={modalRef} isOpen={isOpen} onClose={onClose}>
						<AddItem onSubmit={handleSubmit} />
					</Modal>
				</SuspenseLoader>
			)}
		</>
	);
};

export default ModalProfile;
