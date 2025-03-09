import { useState } from "react";
import ListItem from "./ListItem";
import { AArrowDown, AArrowUp, Snowflake } from "lucide-react";
import listState from "../store/listStore";
import toast from "react-hot-toast";

interface ListProps {
	listId: string;
}
const List: React.FC<ListProps> = ({ listId }) => {
	const [loading, setLoading] = useState(false);
	const { lists, updateList } = listState();
	const [sortBy, setSortBy] = useState<"name" | "refrigerated" | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const list = lists.find((list) => list?.id === listId);

	const handleSort = (criteria: "name" | "refrigerated") => {
		if (sortBy === criteria) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(criteria);
			setSortOrder("asc");
		}
	};

	const toggleItemCompletion = async (itemId: string) => {
		setLoading(true);
		try {
			const updatedItems = list?.items?.map((item) =>
				item.id === itemId ? { ...item, completed: !item.completed } : item
			);
			const res = await updateList(listId, { items: updatedItems });
			if (!res.success) {
				toast.error("Failed to update item");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const getSortedItems = (items: ListItem[] = []) => {
		return [...items].sort((a, b) => {
			if (a.completed !== b.completed) {
				return a.completed ? 1 : -1;
			}
			if (sortBy === "name") {
				const nameA = (a.name || "").toLowerCase();
				const nameB = (b.name || "").toLowerCase();
				return sortOrder === "asc"
					? nameA.localeCompare(nameB)
					: nameB.localeCompare(nameA);
			}

			if (sortBy === "refrigerated") {
				if (a.refrigerated !== b.refrigerated) {
					return sortOrder === "asc"
						? a.refrigerated
							? 1
							: -1
						: b.refrigerated
						? 1
						: -1;
				}
				const nameA = (a.name || "").toLowerCase();
				const nameB = (b.name || "").toLowerCase();
				return nameA.localeCompare(nameB);
			}
			return 0;
		});
	};

	return (
		<div
			className={`min-h-[90vh] bg-[rgb(var(--color-accent-2))] rounded ${
				loading ? "animate-pulse opacity-70" : ""
			}`}
		>
			<div className="flex items-center justify-between w-full">
				<h2 className="flex-grow text-center py-2">
					{list?.title || "My List"}
				</h2>
				<div className="flex justify-end gap-4 mr-4">
					{sortOrder === "asc" ? (
						<AArrowUp
							onClick={() => handleSort("name")}
							className="cursor-pointer"
							size={20}
						/>
					) : (
						<AArrowDown
							onClick={() => handleSort("name")}
							className="cursor-pointer"
							size={20}
						/>
					)}
					<Snowflake
						color={sortBy === "refrigerated" ? "blue" : "gray"}
						onClick={() => handleSort("refrigerated")}
						className="cursor-pointer hover:text-blue-500 ml-2"
						size={20}
					/>
				</div>
			</div>
			<ul>
				{getSortedItems(list?.items)?.map((item) => (
					<ListItem
						key={item?.id}
						item={item}
						canToggle
						onToggleComplete={() => toggleItemCompletion(item?.id)}
					/>
				))}
			</ul>
		</div>
	);
};

export default List;
