import dateFromTimestamp from "../utils/dateFromTimestamp";

type CardProps = {
	list: List;
	onClick?: () => void;
};

const Card: React.FC<CardProps> = ({ list, onClick }) => {
	const completionPercentage = () => {
		if (!list.items || list.items.length === 0) return 0;
		const completedItems = list.items.filter((item) => item.completed).length;
		return Math.round((completedItems / list.items.length) * 100);
	};

	return (
		<div
			onClick={onClick}
			className="bg-[rgb(var(--color-accent-2))] rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full h-full flex flex-col"
		>
			<div className="flex justify-between items-start mb-2">
				<h3 className="text-xl font-semibold truncate">
					{list.title || "Untitled List"}
				</h3>
				{list.category && (
					<span className="capitalize px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
						{list.category}
					</span>
				)}
			</div>

			<p className="mb-3 line-clamp-2 flex-grow">
				{list.description || "No description"}
			</p>

			<div className="mt-auto">
				{list.items && list.items.length > 0 && (
					<div className="mb-2">
						<div className="flex justify-between text-sm mb-1">
							<span>{list.items.length} items</span>
							<span>{completionPercentage()}% complete</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-green-500 h-2 rounded-full"
								style={{ width: `${completionPercentage()}%` }}
							></div>
						</div>
					</div>
				)}

				<div className="flex justify-between text-xs text-[rgb(var(--color-content))] mt-2">
					<span>Created: {dateFromTimestamp(list.createdAt)}</span>
					<span>Updated: {dateFromTimestamp(list.updatedAt)}</span>
				</div>
			</div>
		</div>
	);
};

export default Card;
