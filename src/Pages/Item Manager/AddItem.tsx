import { useRef, useState } from "react";
import generateUuidv4 from "../../utils/uuidv4";
import ListItem from "../../components/ListItem";
import ItemForm from "../../components/ItemForm";
import itemState from "../../store/itemStore";

const AddItem = () => {
	const { createItem } = itemState();
	const [recentItems, setRecentItems] = useState<ListItem[]>([]);
	const listRef = useRef<HTMLUListElement | null>(null);

	const addItem = (item: ListItem) => {
		const newItem: ListItem = {
			name: item?.name || "",
			refrigerated: item?.refrigerated || false,
			category: item?.category || "other",
			unit: item?.unit || "",
			tags: item?.tags || "",
			location: item?.location || "",
		};

		setRecentItems([...recentItems, newItem]);
		createItem(item);
	};

	return (
		<div className="p-4 max-w-md mx-auto flex flex-col md:flex-row gap-4 w-full">
			<ItemForm onSubmit={addItem} />
			<div className="w-full p-4 border rounded shadow-md">
				<h5 className="underline text-center underline-offset-1">
					Recently added
				</h5>
				<ul ref={listRef} className="mt-4 border rounded bg-gray-100 flex-1">
					{recentItems?.length ? (
						recentItems?.map?.((item) => (
							<ListItem key={generateUuidv4()} item={item}></ListItem>
						))
					) : (
						<li>No Changes</li>
					)}
				</ul>
			</div>
		</div>
	);
};

export default AddItem;
