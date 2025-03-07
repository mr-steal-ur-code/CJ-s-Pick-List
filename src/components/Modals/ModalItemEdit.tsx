import itemState from "../../store/itemStore";
import Button from "../Button";
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
	const { deleteItem } = itemState();
	const modalRef = useRef(null);
	const handleSubmit = () => {
		onClose && modalRef?.current?.dismiss();
	};

	const handleDelete = async () => {
		if (!itemId || !confirm("Delete this Item?")) return;
		const res = await deleteItem(itemId);
		if (!res.success) alert("Error Deleting Item");
	};

	return (
		<SuspenseLoader>
			<Modal
				ref={modalRef}
				isOpen={isOpen}
				onClose={onClose}
				footerBtn={
					<Button type="cancel" text="Delete" onClick={handleDelete} />
				}
			>
				<EditItem itemId={itemId} onSubmit={handleSubmit} />
			</Modal>
		</SuspenseLoader>
	);
};

export default ModalProfile;
