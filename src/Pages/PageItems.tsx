import {
	ChevronDown,
	ChevronUp,
	List,
	MapPin,
	Search,
	Snowflake,
} from "lucide-react";
import itemState from "../store/itemStore";
import { useState } from "react";
import Button from "../components/Button";
import ModalItemAdd from "../components/Modals/ModalItemAdd";
import ListItem from "../components/ListItem";
import { categories, locations } from "../globalVariables";
interface PageItemProps {
	isMakingList?: boolean;
	children?: React.ReactNode;
	onItemClick?: (item: ListItem) => void;
	loading?: boolean;
	inListItemIds?: string[];
}
const PageItems: React.FC<PageItemProps> = ({
	isMakingList,
	onItemClick,
	loading,
	inListItemIds,
}) => {
	document.title = "Iten Manager";
	const items = itemState((state) => state.items);
	const [openLocation, setOpenLocation] = useState(false);
	const [openCategory, setOpenCategory] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [toggleModal, setToggleModal] = useState(false);
	const [clickDisabled, setClickDisabled] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState("");
	const [locationFilter, setLocationFilter] = useState("");
	const [refrigeratedFilter, setRefrigeratedFilter] = useState("");
	const [sortField, setSortField] = useState<
		"name" | "category" | "location" | "refrigerated"
	>("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const handleSort = (
		field: "name" | "category" | "location" | "refrigerated"
	) => {
		setSortOrder((prev) =>
			sortField === field ? (prev === "asc" ? "desc" : "asc") : "asc"
		);
		setSortField(field);
	};

	const filteredItems = items
		?.filter((item) =>
			item.name?.toLowerCase().includes(searchQuery.toLowerCase())
		)
		?.filter((item) => !categoryFilter || item.category === categoryFilter)
		?.filter((item) => !locationFilter || item.location === locationFilter)
		?.filter(
			(item) =>
				refrigeratedFilter === "" ||
				String(item.refrigerated) === refrigeratedFilter
		)
		?.filter((item) => !isMakingList || !inListItemIds?.includes(item.id))
		?.sort((a, b) => {
			let valueA = a[sortField] ?? "";
			let valueB = b[sortField] ?? "";

			if (sortField === "refrigerated") {
				valueA = a.refrigerated ? "true" : "false";
				valueB = b.refrigerated ? "true" : "false";
			}

			return sortOrder === "asc"
				? valueA.toString().localeCompare(valueB.toString())
				: valueB.toString().localeCompare(valueA.toString());
		});

	const handleDebounceClose = () => {
		setToggleModal(false);
		setClickDisabled(true);
		setTimeout(() => setClickDisabled(false), 300);
	};

	return (
		<div className="fade-in">
			<div className="p-2 flex flex-col sm:flex-row items-start gap-2 w-full">
				<div className="flex flex-row items-center justify-center gap-2 w-full">
					<button
						onClick={() => handleSort("name")}
						className="flex items-center gap-2 border p-2 rounded 
        bg-[rgb(var(--color-bkg2))] text-[rgb(var(--color-content))] 
        border-[rgb(var(--color-secondary))] hover:bg-[rgba(var(--color-hover-bkg))] 
        transition h-10"
					>
						{sortField === "name" &&
							(sortOrder === "asc" ? (
								<ChevronUp
									className="text-[rgb(var(--color-content))]"
									size={18}
								/>
							) : (
								<ChevronDown
									className="text-[rgb(var(--color-content))]"
									size={18}
								/>
							))}
					</button>
					<div className="relative flex-1 w-full">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 
          text-[rgb(var(--color-secondary))]"
							size={18}
						/>

						<input
							type="text"
							placeholder="Search items..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="border p-2 pl-10 rounded h-10
              bg-[rgb(var(--color-bkg2))] text-[rgb(var(--color-content))] 
              border-[rgb(var(--color-secondary))] hover:bg-[rgba(var(--color-hover-bkg))] 
              focus:border-[rgb(var(--color-secondary))] focus:ring-2 focus:ring-[rgb(var(--color-secondary))] 
              transition outline-none w-full"
						/>
					</div>
				</div>
				<div className="flex flex-row gap-2 self-end">
					<div className="relative">
						<button
							onClick={() => setOpenCategory(!openCategory)}
							className="flex items-center gap-2 border p-2 rounded justify-between w-full
            bg-[rgb(var(--color-bkg2))] text-[rgb(var(--color-content))] 
            border-[rgb(var(--color-secondary))] hover:bg-[rgba(var(--color-hover-bkg))] transition"
						>
							<List className="text-[rgb(var(--color-content))]" size={20} />
							<ChevronDown size={18} />
						</button>

						{openCategory && (
							<div
								className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-10"
								onClick={() => setOpenCategory(false)}
							>
								<div
									className="w-96 p-4 rounded shadow-md bg-[rgb(var(--color-bkg2))] 
                border border-[rgb(var(--color-secondary))] text-[rgb(var(--color-content))]"
									onClick={(e) => e.stopPropagation()}
								>
									<div
										onClick={() => {
											setCategoryFilter("");
											setOpenCategory(false);
										}}
										className="px-4 py-2 cursor-pointer hover:bg-[rgba(var(--color-hover-bkg))] transition"
									>
										All Categories
									</div>
									{categories.map((cat) => (
										<div
											key={cat}
											onClick={() => {
												setCategoryFilter(cat);
												setOpenCategory(false);
											}}
											className="px-4 py-2 cursor-pointer hover:bg-[rgba(var(--color-hover-bkg))] transition"
										>
											{cat}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
					<div className="relative">
						<button
							onClick={() => setOpenLocation(!openLocation)}
							className="flex items-center gap-2 border p-2 rounded justify-between w-full
            bg-[rgb(var(--color-bkg2))] text-[rgb(var(--color-content))] 
            border-[rgb(var(--color-secondary))] hover:bg-[rgba(var(--color-hover-bkg))] transition"
						>
							<MapPin className="text-[rgb(var(--color-content))]" size={20} />
							<ChevronDown size={18} />
						</button>

						{openLocation && (
							<div
								className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-10"
								onClick={() => setOpenLocation(false)}
							>
								<div
									className="w-96 p-4 rounded shadow-md bg-[rgb(var(--color-bkg2))] 
                border border-[rgb(var(--color-secondary))] text-[rgb(var(--color-content))]"
									onClick={(e) => e.stopPropagation()}
								>
									<div
										onClick={() => {
											setLocationFilter("");
											setOpenLocation(false);
										}}
										className="px-4 py-2 cursor-pointer hover:bg-[rgba(var(--color-hover-bkg))] transition"
									>
										All Locations
									</div>
									{locations?.map((loc) => (
										<div
											key={loc}
											onClick={() => {
												setLocationFilter(loc);
												setOpenLocation(false);
											}}
											className="px-4 py-2 cursor-pointer hover:bg-[rgba(var(--color-hover-bkg))] transition"
										>
											{loc}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={refrigeratedFilter === "true"}
							onChange={() =>
								setRefrigeratedFilter(
									refrigeratedFilter === "true" ? "" : "true"
								)
							}
							className="hidden"
						/>
						<div
							className={`p-2 border rounded flex items-center justify-center
            bg-[rgb(var(--color-bkg2))] border-[rgb(var(--color-secondary))] 
            hover:bg-[rgba(var(--color-hover-bkg))] transition
            ${
							refrigeratedFilter === "true"
								? "bg-[rgb(var(--color-accent-1))] border-blue-500"
								: ""
						}`}
						>
							<Snowflake
								size={20}
								className={`${
									refrigeratedFilter === "true"
										? "text-blue-500"
										: "text-gray-400"
								}`}
							/>
						</div>
					</label>
				</div>
			</div>
			{!isMakingList && (
				<>
					<div className="mb-2 flex flex-row items-center gap-12 justify-end">
						<h3 className="m-auto text-[rgb(var(--color-secondary))] px-4 py-2 rounded-lg font-bold shadow-md">
							Item Manager
						</h3>
						<Button
							type="outline"
							text="Add"
							onClick={() => !clickDisabled && setToggleModal(true)}
						/>
					</div>
					<ModalItemAdd isOpen={toggleModal} onClose={handleDebounceClose} />
				</>
			)}
			<div className={loading ? "pointer-events-none " : ""}>
				{filteredItems?.length > 0 ? (
					filteredItems.map((item) => (
						<ListItem
							canToggle={isMakingList}
							onToggleComplete={() => {
								setSearchQuery("");
								onItemClick(item);
							}}
							isEditable={!isMakingList}
							key={item?.id}
							item={item}
						/>
					))
				) : (
					<h4 className="text-center py-6 text-gray-500">No items found</h4>
				)}
			</div>
		</div>
	);
};

export default PageItems;
