import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import listState from "../store/listStore";
import PageItems from "./PageItems";
import toast from "react-hot-toast";
import { useState } from "react";
import { categories } from "../globalVariables";

const PageList: React.FC = () => {
	const navigate = useNavigate();
	const { listId } = useParams();
	const [loading, setLoading] = useState(false);
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
			toast.success("Item Added to List");
		}
	};

	return (
		<>
			{listId ? (
				<PageItems
					loading={loading}
					onItemClick={handleAddToList}
					isMakingList
					inListItemIds={currentList?.items?.map((item) => item?.id)}
					children={
						<div className="text-primary">
							<h4 className="text-center">
								Adding items to{" "}
								<span className="text-[rgb(var(--color-secondary))] font-bold capitalize">
									{currentList?.title}
								</span>
							</h4>
						</div>
					}
				/>
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
