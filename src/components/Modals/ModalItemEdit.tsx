import itemState from "../../store/itemStore";
import Button from "../Button";
import EditItem from "../EditItem";
import { lazy, useRef } from "react";
import SuspenseLoader from "../SuspenseLoader";
const Modal = lazy(() => import("./Modal"));

type ModalItemAddProps = {
	isOpen: boolean;
	onClose: () => void;
	itemId?: string;
};
const ModalProfile: React.FC<ModalItemAddProps> = ({
	isOpen,
	onClose,
	itemId,
}) => {
	const { deleteItem } = itemState();
	const modalRef = useRef(null);
	const handleSubmit = () => {
		if (onClose) modalRef?.current?.dismiss();
	};

	const handleDelete = async () => {
		if (!itemId || !confirm("Delete this Item?")) return;
		const res = await deleteItem(itemId);
		if (!res.success) alert("Error Deleting Item");
	};

	return (
		<>
			{isOpen && (
				<SuspenseLoader>
					<Modal
						ref={modalRef}
						isOpen={isOpen}
						onClose={onClose}
						footerLeftBtn={
							<Button type="cancel" text="Delete" onClick={handleDelete} />
						}
					>
						<EditItem itemId={itemId} onSubmit={handleSubmit} />
					</Modal>
				</SuspenseLoader>
			)}
		</>
	);
};

export default ModalProfile;
