import { useState } from "react";
import itemState from "../store/itemStore";
import ItemForm from "./ItemForm";

interface AddItemProps {
	onSubmit?: () => void;
}
const AddItem: React.FC<AddItemProps> = ({ onSubmit }) => {
	const { createItem } = itemState();
	const [error, setError] = useState("");

	const addItem = async (item: ListItem) => {
		setError("");
		const newItem: ListItem = {
			name: item?.name || "",
			refrigerated: item?.refrigerated || false,
			category: item?.category || "other",
			unit: item?.unit || "",
			tags: item?.tags || "",
			quantity: 1,
			location: item?.location || "",
		};

		const res = await createItem(newItem);
		if (res.success) {
			if (onSubmit) {
				onSubmit();
			}
		} else setError("Error Creating Item");
	};

	return (
		<>
			<ItemForm error={error} onSubmit={(e) => addItem(e)} />
		</>
	);
};

export default AddItem;
