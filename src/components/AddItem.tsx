import itemState from "../store/itemStore";
import ItemForm from "./ItemForm";

const AddItem = () => {
	const { createItem } = itemState();

	const addItem = (item: ListItem) => {
		const newItem: ListItem = {
			name: item?.name || "",
			refrigerated: item?.refrigerated || false,
			category: item?.category || "other",
			unit: item?.unit || "",
			tags: item?.tags || "",
			location: item?.location || "",
		};

		createItem(newItem);
	};

	return (
		<>
			<ItemForm onSubmit={addItem} />
		</>
	);
};

export default AddItem;
