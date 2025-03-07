import EditItem from "../EditItem";
import SuspenseLoader from "../SuspenseLoader";
import { lazy, useRef } from "react";

type ModalItemAddProps = {
	isOpen: boolean;
	onClose: () => void;
	itemId?: string;
};
const Modal = lazy(() => import("./Modal"));
const ModalProfile: React.FC<ModalItemAddProps> = ({
	isOpen,
	onClose,
	itemId,
}) => {
	const modalRef = useRef<ModalHandle>(null);

	return (
		<SuspenseLoader>
			<Modal closeButton ref={modalRef} isOpen={isOpen} onClose={onClose}>
				<EditItem itemId={itemId} />
			</Modal>
		</SuspenseLoader>
	);
};

export default ModalProfile;
