import { useEffect, useState } from "react";
import ListItem from "../../components/ListItem";
import itemState from "../../store/itemStore";
import { useParams } from "react-router-dom";
import ItemForm from "../../components/ItemForm";

const EditItem: React.FC = () => {
	const { itemId } = useParams<{ itemId: string }>();
	const { items, updateItem } = itemState();
	const [currentItem, setCurrentItem] = useState<ListItem>({});

	useEffect(() => {
		if (items) {
			const foundItem = items.find((item) => item?.id === itemId);
			if (foundItem) setCurrentItem(foundItem);
		}
	}, [itemId, items]);

	return (
		<div className="p-4 max-w-md mx-auto flex flex-col md:flex-row gap-4 w-full">
			<ListItem item={currentItem} />
			<ItemForm
				listItem={currentItem}
				onSubmit={(e) => updateItem(itemId!, e)}
			/>
		</div>
	);
};

export default EditItem;
