import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import listState from "../store/listStore";
import PageItems from "./PageItems";
import toast from "react-hot-toast";
import { useState } from "react";
import { categories } from "../globalVariables";
import AddRecipeItems from "../components/AddRecipeItems";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";

const PageList: React.FC = () => {
	const navigate = useNavigate();
	const { listId } = useParams();
	const [loading, setLoading] = useState(false);
	const [editingItems, setEditingItems] = useState({});
	const [viewMode, setViewMode] = useState<"add" | "edit">("add");
	const { createList, lists, updateList } = listState();
	const currentList: List = lists?.find((list) => list?.id === listId);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const createListRes = await createList(
			Object.fromEntries(formData.entries())
		);

		if (createListRes.success && createListRes?.id) {
			navigate(`/lists/${createListRes?.id}`);
		}
	};

	const handleAddToList = async (item: ListItem) => {
		setLoading(true);
		const updateRes = await updateList(listId, {
			...currentList,
			items: [...(currentList?.items || []), item],
		});

		if (updateRes?.success) {
			setLoading(false);
			toast?.dismiss();
			toast.success("List Updated", { duration: 800 });
		}
	};

	const handleRemoveFromList = async (item: ListItem) => {
		setLoading(true);
		const updatedItems = (currentList?.items || [])
			.map((listItem) => {
				if (listItem.id !== item.id) {
					return listItem;
				}
				const currentQuantity = Number(listItem.quantity) || 1;

				const newQuantity = currentQuantity - 1;

				return {
					...listItem,
					quantity: newQuantity,
				};
			})
			.filter((listItem) => {
				return listItem.id !== item.id || Number(listItem.quantity) > 0;
			});

		const updateRes = await updateList(listId, {
			...currentList,
			items: updatedItems,
		});
		if (updateRes?.success) {
			toast?.dismiss();
			toast.success("List Updated", { duration: 800 });
		}

		setLoading(false);
		return updateRes;
	};

	const handleIncreaseQuantity = async (item) => {
		const newQuantity = (Number(item.quantity) || 1) + 1;
		await updateItemQuantity(item, newQuantity);
	};

	const handleDecreaseQuantity = async (item) => {
		const currentQuantity = Number(item.quantity) || 1;

		if (currentQuantity <= 1) {
			await handleRemoveFromList(item);
		} else {
			await updateItemQuantity(item, currentQuantity - 1);
		}
	};

	const handleQuantityChange = (item, e) => {
		const inputValue = e.target.value;

		setEditingItems({
			...editingItems,
			[item.id]: inputValue,
		});
	};

	const saveQuantity = async (item) => {
		const newValue = editingItems[item.id];

		if (newValue !== undefined) {
			const newQuantity = Number(newValue);

			if (
				!isNaN(newQuantity) &&
				newQuantity > 0 &&
				newQuantity !== Number(item.quantity)
			) {
				await updateItemQuantity(item, newQuantity);
			}

			const newEditingItems = { ...editingItems };
			delete newEditingItems[item.id];
			setEditingItems(newEditingItems);
		}
	};

	const updateItemQuantity = async (item, newQuantity) => {
		const updatedItems = currentList?.items?.map((listItem) => {
			if (listItem.id === item.id) {
				return { ...listItem, quantity: newQuantity };
			}

			return listItem;
		});

		const updateRes = await updateList(currentList.id, {
			...currentList,
			items: updatedItems,
		});
		if (updateRes?.success) {
			toast?.dismiss();
			toast.success("List Updated", { duration: 800 });
		}
	};

	const handleKeyPress = (e, item) => {
		if (e.key === "Enter") {
			saveQuantity(item);
		}
	};

	const handleDelete = async (item, e) => {
		e.stopPropagation();
		if (!confirm(`Delete All ${item?.name}?`)) return;

		const updatedItems = currentList.items.filter(
			(listItem) => listItem.id !== item.id
		);

		const updateRes = await updateList(currentList.id, {
			...currentList,
			items: updatedItems,
		});
		if (updateRes?.success) {
			toast?.dismiss();
			toast.success("List Updated", { duration: 800 });
		}
	};

	return (
		<>
			{listId ? (
				<>
					<h3 className="text-center text-[rgb(var(--color-secondary))] px-4 py-2 rounded-lg font-bold shadow-md">
						<span className="text-[rgb(var(--color-secondary))] font-bold capitalize">
							Manage Items on {currentList?.title}
						</span>
					</h3>
					<div className="flex items-center justify-end px-4 py-2 shadow-sm">
						<div className="flex items-center gap-4">
							<AddRecipeItems addTolistId={currentList?.id} />
							<button
								onClick={() => setViewMode("add")}
								className={`px-3 py-1 cursor-pointer rounded-l-md text-sm ${
									viewMode === "add"
										? "bg-primary text-white"
										: "bg-gray-200 text-gray-700"
								}`}
							>
								Add
							</button>
							<button
								onClick={() => setViewMode("edit")}
								className={`px-2 py-1 cursor-pointer rounded-r-md text-sm ${
									viewMode === "edit"
										? "bg-primary text-white"
										: "bg-gray-200 text-gray-700"
								}`}
							>
								Edit
							</button>
						</div>
					</div>

					{viewMode === "add" ? (
						<PageItems
							loading={loading}
							onItemClick={handleAddToList}
							isMakingList
							inListItemIds={currentList?.items?.map((item) => item?.id)}
						/>
					) : (
						<div
							className={`p-4 ${
								loading ? "animate-pulse opacity-25 pointer-events-none" : ""
							}`}
						>
							{loading && (
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
									<div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
								</div>
							)}

							{currentList?.items?.length > 0 ? (
								currentList.items.map((item) => (
									<div
										key={item.id}
										className="bg-[rgb(var(--color-bkg2))] border border-[rgb(var(--color-secondary))] p-3 rounded-md mb-2 shadow-sm flex justify-between items-center"
									>
										<div className="flex-grow">
											<h3 className="font-medium">{item.name}</h3>
										</div>

										<div className="flex items-center gap-4">
											<div className="flex items-center gap-1 mr-2">
												<button
													className="text-[rgb(var(--color-secondary))]"
													onClick={() => handleDecreaseQuantity(item)}
													aria-label="Decrease quantity"
												>
													<MinusCircle size={30} />
												</button>

												<input
													type="text"
													className="w-12 text-center mx-2 p-1 border rounded-md"
													value={
														editingItems[item?.id] !== undefined
															? editingItems[item?.id]
															: item?.quantity || 1
													}
													onChange={(e) => handleQuantityChange(item, e)}
													onBlur={() => saveQuantity(item)}
													onKeyDown={(e) => handleKeyPress(e, item)}
													aria-label="Quantity"
												/>

												<button
													className="text-[rgb(var(--color-secondary))]"
													onClick={() => handleIncreaseQuantity(item)}
													aria-label="Increase quantity"
												>
													<PlusCircle size={30} />
												</button>
											</div>

											<button
												className="text-[rgb(var(--color-danger))]"
												onClick={(e) => handleDelete(item, e)}
												aria-label="Delete item"
											>
												<Trash2 size={30} />
											</button>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-10 text-gray-500">
									<p>No items in this list yet</p>
									<button
										className="mt-2 text-primary font-medium"
										onClick={() => setViewMode("add")}
									>
										Add some items
									</button>
								</div>
							)}
						</div>
					)}
				</>
			) : (
				<div className="min-h-screen flex items-start justify-center pt-[7vh]">
					<form
						onSubmit={(e) => handleSubmit(e)}
						className="p-4 w-[90%] max-w-sm flex flex-col gap-2 items-center justify-center"
					>
						<Input
							className="color-"
							name="title"
							labelType="floating"
							labelText="List Title"
							required
						/>
						<Input
							name="description"
							labelType="floating"
							labelText="Description"
						/>
						<select name="category" className="w-full">
							<option value="">Select Category</option>
							{categories?.map((category) => (
								<option key={category} value={category}>
									{category.charAt(0).toUpperCase() + category.slice(1)}
								</option>
							))}
						</select>
						<Button className="w-full" text="Create" submit />
					</form>
				</div>
			)}
		</>
	);
};

export default PageList;
