import { useState } from "react";
import itemState from "../store/itemStore";
import ItemForm from "./ItemForm";
import ListItem from "./ListItem";

interface EditItemProps {
	itemId: string;
	onSubmit?: () => void;
}
const EditItem: React.FC<EditItemProps> = ({ itemId, onSubmit }) => {
	const { items, updateItem } = itemState();
	const [error, setError] = useState("");

	const currentItem = items.find((item) => item?.id === itemId);

	const handleSubmit = async (e) => {
		setError("");
		const res = await updateItem(itemId, e);
		if (res.success) {
			if (onSubmit) onSubmit();
		} else setError("Error Updating Item");
	};

	return (
		<div className="p-4 max-w-md mx-auto flex flex-col md:flex-row gap-4 w-full">
			<ListItem item={currentItem} />
			<ItemForm
				error={error}
				listItem={currentItem}
				onSubmit={(e) => handleSubmit(e)}
			/>
		</div>
	);
};

export default EditItem;
