import { useEffect, useRef, useState } from "react";
import listState from "../store/listStore";
import { ChefHat } from "lucide-react";

interface AddRecipeItemsProps {
	addTolistId: string;
}
const AddRecipeItems: React.FC<AddRecipeItemsProps> = ({ addTolistId }) => {
	const selectRef = useRef<HTMLSelectElement | null>(null);
	const dropdownRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const { lists, updateList } = listState();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleAdd = async (selectedListId: string) => {
		if (!selectedListId) return;
		setIsOpen(false);

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

	const recipeOptions = lists
		?.filter?.((list) => list.category === "recipe")
		?.map((recList) => ({
			id: recList?.id,
			title: recList?.title,
		}));

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				className="p-1 px-2 bg-blue-500 text-white rounded-sm flex items-center justify-center shadow-md cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Add recipe"
			>
				<ChefHat size={20} />
			</button>

			<select
				ref={selectRef}
				className="sr-only"
				value=""
				onChange={(e) => handleAdd(e?.target?.value)}
			>
				{recipeOptions?.map((recipe) => (
					<option key={recipe.id} value={recipe.id}>
						{recipe.title}
					</option>
				))}
			</select>

			{isOpen && (
				<div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 left-0 max-h-60 overflow-y-auto">
					{recipeOptions?.length > 0 ? (
						recipeOptions.map((recipe) => (
							<button
								key={recipe.id}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => handleAdd(recipe.id)}
							>
								{recipe.title}
							</button>
						))
					) : (
						<div className="px-4 py-2 text-sm text-gray-500">
							No recipes available
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default AddRecipeItems;
