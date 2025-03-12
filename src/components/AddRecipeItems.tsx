import { useEffect, useRef, useState } from "react";
import listState from "../store/listStore";
import { ChefHat } from "lucide-react";
import toast from "react-hot-toast";

interface AddRecipeItemsProps {
	addTolistId: string;
}
const AddRecipeItems: React.FC<AddRecipeItemsProps> = ({ addTolistId }) => {
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

		const selectedList = lists?.find((list) => list?.id === selectedListId);
		const targetList = lists?.find((list) => list?.id === addTolistId);

		if (!selectedList || !targetList) return;

		const itemsToAdd = selectedList?.items || [];
		const currentItems = targetList?.items || [];

		const existingItemsMap = new Map();
		currentItems?.forEach((item) => {
			existingItemsMap?.set(item?.id, item);
		});

		const updatedItems = [...currentItems];

		itemsToAdd.forEach((newItem) => {
			const existingItem = existingItemsMap?.get(newItem?.id);

			if (existingItem) {
				const existingIndex = updatedItems.findIndex(
					(item) => item?.id === newItem?.id
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

		const res = await updateList(addTolistId, updatedTargetList);
		toast.dismiss();
		if (res?.success) {
			toast.success("Recipe Items Added", { duration: 1200 });
		} else toast.error("Error adding Recipe Items");
	};

	const recipeOptions = lists
		?.filter?.((list) => list.category === "recipe")
		?.map((recList) => ({
			id: recList?.id,
			title: recList?.title,
		}));

	return (
		<div className="relative">
			<button
				className="p-1 px-2 bg-blue-500 text-white rounded-sm flex items-center justify-center shadow-md cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Add recipe"
			>
				<ChefHat size={20} />
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-10"
					onClick={() => setIsOpen(false)}
				>
					<div
						className="w-96 p-4 rounded shadow-md bg-[rgb(var(--color-bkg2))] 
                border border-[rgb(var(--color-secondary))] text-[rgb(var(--color-content))]"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="max-h-64 overflow-y-auto">
							{recipeOptions?.length > 0 ? (
								recipeOptions.map((recipe) => (
									<button
										key={recipe.id}
										className="block w-full text-left px-4 py-2 my-4 rounded-md text-sm border border-tertiary"
										onClick={() => handleAdd(recipe?.id)}
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
					</div>
				</div>
			)}
		</div>
	);
};

export default AddRecipeItems;
