import AddItem from "../AddItem";
import { lazy, useRef } from "react";

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
		<Modal ref={modalRef} isOpen={isOpen} onClose={onClose}>
			<AddItem onSubmit={handleSubmit} />
		</Modal>
	);
};

export default ModalProfile;
