import AddItem from "../AddItem";
import SuspenseLoader from "../SuspenseLoader";
import { lazy, useRef } from "react";

type ModalItemAddProps = {
	isOpen: boolean;
	onClose: () => void;
};
const Modal = lazy(() => import("./Modal"));
const ModalProfile: React.FC<ModalItemAddProps> = ({ isOpen, onClose }) => {
	const modalRef = useRef<ModalHandle>(null);

	return (
		<SuspenseLoader>
			<Modal closeButton ref={modalRef} isOpen={isOpen} onClose={onClose}>
				<AddItem />
			</Modal>
		</SuspenseLoader>
	);
};

export default ModalProfile;
