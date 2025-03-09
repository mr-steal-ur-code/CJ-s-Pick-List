import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import listState from "../store/listStore";
import PageItems from "./PageItems";
import toast from "react-hot-toast";
import { useState } from "react";
import { categories } from "../globalVariables";
import AddRecipeItems from "../components/AddRecipeItems";

const PageList: React.FC = () => {
	const navigate = useNavigate();
	const { listId } = useParams();
	const [loading, setLoading] = useState(false);
	const [viewMode, setViewMode] = useState<"add" | "remove">("add");
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
		const addItemRes = await updateList(listId, {
			...currentList,
			items: [...(currentList?.items || []), item],
		});

		if (addItemRes.success) {
			setLoading(false);
			toast.success("Item Added to List", { duration: 700 });
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

		const removeRes = await updateList(listId, {
			...currentList,
			items: updatedItems,
		});

		setLoading(false);
		return removeRes;
	};

	return (
		<>
			{listId ? (
				<>
					<div className="flex items-center justify-between px-4 py-2 shadow-sm">
						<h4 className="text-primary">
							<span className="text-[rgb(var(--color-secondary))] font-bold capitalize">
								{currentList?.title}
							</span>
						</h4>
						<AddRecipeItems addTolistId={currentList?.id} />
						<div className="flex items-center gap-2">
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
								onClick={() => setViewMode("remove")}
								className={`px-2 py-1 cursor-pointer rounded-r-md text-sm ${
									viewMode === "remove"
										? "bg-primary text-white"
										: "bg-gray-200 text-gray-700"
								}`}
							>
								Remove
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
										className="bg-[rgb(var(--color-bkg2))] border-2 border-[rgb(var(--color-danger))] p-3 rounded-md mb-2 shadow-sm flex justify-between items-center cursor-pointer hover:bg-[rgb(var(--color-bkg))]"
										onClick={() => handleRemoveFromList(item)}
									>
										<div>
											<h3 className="font-medium">
												{item.name}
												{!!Number(item?.quantity) && (
													<span className="text-[rgb(var(--color-secondary))] ml-2">
														({item?.quantity})
													</span>
												)}
											</h3>
										</div>
										<button className="text-red-500">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="3 6 5 6 21 6"></polyline>
												<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
											</svg>
										</button>
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
