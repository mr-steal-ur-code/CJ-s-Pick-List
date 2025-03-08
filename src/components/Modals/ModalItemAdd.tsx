import AddItem from "../AddItem";
import SuspenseLoader from "../SuspenseLoader";
import { lazy, useRef } from "react";

type ModalItemAddProps = {
	isOpen: boolean;
	onClose: () => void;
};
const Modal = lazy(() => import("./Modal"));
const ModalProfile: React.FC<ModalItemAddProps> = ({ isOpen, onClose }) => {
	const modalRef = useRef(null);
	const handleSubmit = () => {
		onClose && modalRef?.current?.dismiss();
	};
	return (
		<SuspenseLoader>
			<Modal ref={modalRef} isOpen={isOpen} onClose={onClose}>
				<AddItem onSubmit={handleSubmit} />
			</Modal>
		</SuspenseLoader>
	);
};

export default ModalProfile;
