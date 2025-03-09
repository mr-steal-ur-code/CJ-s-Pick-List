import { useState } from "react";
import ListItem from "./ListItem";
import { AArrowDown, AArrowUp, Snowflake } from "lucide-react";

const List: React.FC<List> = ({ items = [], name = "title" }) => {
	const [sortBy, setSortBy] = useState<"name" | "refrigerated" | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const handleSort = (criteria: "name" | "refrigerated") => {
		if (sortBy === criteria) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(criteria);
			setSortOrder("asc");
		}
	};

	const sortedItems = [...items].sort((a, b) => {
		if (!sortBy) return 0;
		if (sortBy === "refrigerated") {
			return sortOrder === "desc"
				? Number(a.refrigerated) - Number(b.refrigerated)
				: Number(b.refrigerated) - Number(a.refrigerated);
		}
		if (sortBy === "name") {
			return sortOrder === "asc"
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name);
		}
		return 0;
	});

	return (
		<div className="bg-[rgb(var(--color-accent-2))] rounded mt-6">
			<div className="flex items-center justify-between w-full">
				<h2 className="flex-grow text-center">{name}</h2>
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
				{sortedItems.map((item) => (
					<ListItem key={item.name} item={item} />
				))}
			</ul>
		</div>
	);
};

export default List;
