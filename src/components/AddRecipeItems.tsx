import { useRef } from "react";
import listState from "../store/listStore";

interface AddRecipeItemsProps {
	addTolistId: string;
}
const AddRecipeItems: React.FC<AddRecipeItemsProps> = ({ addTolistId }) => {
	const selectRef = useRef<HTMLSelectElement | null>(null);
	const { lists, updateList } = listState();

	const handleAdd = async (selectedListId: string) => {
		if (!selectedListId) return;

		const selectedList = lists.find((list) => list.id === selectedListId);
		const targetList = lists.find((list) => list.id === addTolistId);

		if (!selectedList || !targetList) return;

		const itemsToAdd = selectedList.items || [];
		const currentItems = targetList.items || [];

		const existingItemsMap = new Map();
		currentItems.forEach((item) => {
			existingItemsMap.set(item.id, item);
		});

		const updatedItems = [...currentItems];

		itemsToAdd.forEach((newItem) => {
			const existingItem = existingItemsMap.get(newItem.id);

			if (existingItem) {
				const existingIndex = updatedItems.findIndex(
					(item) => item.id === newItem.id
				);

				const existingQuantity = Number(existingItem.quantity) || 0;
				const newQuantity = Number(newItem.quantity) || 0;

				updatedItems[existingIndex] = {
					...existingItem,
					quantity: existingQuantity + newQuantity,
				};
			} else {
				updatedItems.push(newItem);
			}
		});

		const updatedTargetList = {
			...targetList,
			items: updatedItems,
		};

		await updateList(addTolistId, updatedTargetList);
		selectRef.current.value = "";
	};

	return (
		<select ref={selectRef} onChange={(e) => handleAdd(e?.target?.value)}>
			<option value="">Add Recipe</option>
			{lists
				?.filter?.((list) => list.category === "recipe")
				?.map((recList) => (
					<option key={recList?.id} value={recList?.id}>
						{recList?.title}
					</option>
				))}
		</select>
	);
};

export default AddRecipeItems;
