import { useState } from "react";
import Button from "../components/Button";
import ListCardGrid from "../components/ListCardGrid";
import listState from "../store/listStore";
import { categories } from "../globalVariables";

const PageLists: React.FC = () => {
	const { lists } = listState();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const getFilteredLists = () => {
		if (!lists) return [];
		if (!selectedCategory || selectedCategory === "all") {
			return lists;
		}
		return lists.filter((list) => list.category === selectedCategory);
	};

	return (
		<div className="fade-in py-4">
			<div className="flex flex-col gap-4 px-4 pb-4">
				<div className="flex flex-row justify-evenly items-center">
					<select
						onChange={(e) =>
							setSelectedCategory(
								e?.target?.value === "all" ? null : e?.target?.value
							)
						}
					>
						<option value="all">All</option>
						{categories?.map((category) => (
							<option key={category} value={category}>
								{category.charAt(0).toUpperCase() + category.slice(1)}
							</option>
						))}
					</select>
					<Button href="/lists/new" type="outline" text="New List" />
				</div>
			</div>
			<ListCardGrid lists={getFilteredLists()} />
		</div>
	);
};

export default PageLists;
