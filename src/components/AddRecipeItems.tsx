import { useEffect, useRef, useState } from "react";
import listState from "../store/listStore";
import { ChefHat } from "lucide-react";
import toast from "react-hot-toast";
import Button from "./Button";

interface AddRecipeItemsProps {
	addTolistId: string;
}
const AddRecipeItems: React.FC<AddRecipeItemsProps> = ({ addTolistId }) => {
	const dropdownRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const { lists, updateList } = listState();
	const [selectedRecipes, setSelectedRecipes] = useState<
		Record<string, number>
	>({});

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

	const toggleSelect = (id) => {
		setSelectedRecipes((prev) => {
			const newSelection = { ...prev };
			if (newSelection[id]) {
				delete newSelection[id];
			} else {
				newSelection[id] = 1;
			}
			return newSelection;
		});
	};

	const updateCount = (id, count) => {
		setSelectedRecipes((prev) => ({
			...prev,
			[id]: Math.max(1, Number(count) || 1),
		}));
	};

	const handleSubmit = () => {
		const selected = Object.entries(selectedRecipes)?.map(([id, count]) => ({
			id,
			count,
		}));
		handleAdd(selected);
	};

	const handleAdd = async (
		selectedRecipesWithCount: { id: string; count: number }[]
	) => {
		if (!selectedRecipesWithCount?.length) return;

		const targetList = lists?.find((list) => list?.id === addTolistId);
		if (!targetList) return;

		const currentItems = targetList?.items || [];
		const existingItemsMap = new Map();
		currentItems?.forEach((item) => {
			existingItemsMap.set(item?.id, item);
		});

		const updatedItems = [...currentItems];

		selectedRecipesWithCount.forEach(({ id: selectedListId, count }) => {
			const selectedList = lists?.find((list) => list?.id === selectedListId);
			if (!selectedList) return;

			const itemsToAdd = selectedList?.items || [];

			itemsToAdd.forEach((newItem) => {
				const quantityToAdd = (Number(newItem?.quantity) || 1) * count;
				const existingItem = existingItemsMap.get(newItem?.id);

				if (existingItem) {
					const existingIndex = updatedItems?.findIndex(
						(item) => item?.id === newItem?.id
					);
					const existingQuantity = Number(existingItem?.quantity) || 0;

					updatedItems[existingIndex] = {
						...existingItem,
						quantity: existingQuantity + quantityToAdd,
					};
				} else {
					updatedItems.push({
						...newItem,
						quantity: quantityToAdd,
					});
				}
			});
		});

		const updatedTargetList = {
			...targetList,
			items: updatedItems,
		};

		const res = await updateList(addTolistId, updatedTargetList);
		toast.dismiss();
		setIsOpen(false);
		setSelectedRecipes({});
		if (res?.success) {
			toast.success("Recipe Items Added", { duration: 1200 });
		} else {
			toast.error("Error adding Recipe Items");
		}
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
					className="z-50 fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]"
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
									<div
										key={recipe?.id}
										className="flex items-center justify-between px-2 py-3 my-2 border border-tertiary rounded-md text-sm"
									>
										<div className="flex items-center space-x-2">
											<input
												className="w-5 h-5"
												type="checkbox"
												checked={recipe?.id in selectedRecipes}
												onChange={() => toggleSelect(recipe?.id)}
											/>
											<span
												className="cursor-pointer"
												onClick={() => toggleSelect(recipe?.id)}
											>
												{recipe?.title}
											</span>
										</div>
										{recipe?.id in selectedRecipes && (
											<input
												type="number"
												min="1"
												value={selectedRecipes[recipe?.id]}
												onChange={(e) =>
													updateCount(recipe?.id, e.target?.value)
												}
												className="w-9 border rounded text-center"
											/>
										)}
									</div>
								))
							) : (
								<div className="px-4 py-2 text-sm text-gray-500">
									No recipes available
								</div>
							)}
						</div>
						<div className="flex justify-between p-2 pt-6">
							<Button
								type="cancel"
								onClick={() => {
									setSelectedRecipes({});
								}}
								disabled={Object.keys(selectedRecipes)?.length === 0}
								text="Clear"
							/>
							<Button
								onClick={handleSubmit}
								disabled={Object.keys(selectedRecipes)?.length === 0}
								text="Add Selected Recipes"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddRecipeItems;
