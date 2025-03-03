import {
	LucideIcon,
	Snowflake,
	Package,
	ShoppingCart,
	Briefcase,
	Home,
	Calendar,
	Box,
	ShoppingBag,
	Archive,
} from "lucide-react";

type ListItemProps = {
	item: ListItem;
	className?: string;
};

const categoryIcons: Record<NonNullable<ListItem["category"]>, LucideIcon> = {
	grocery: ShoppingCart,
	work: Briefcase,
	household: Home,
	event: Calendar,
	other: Package,
	"": Package,
};

const unitIcons: Record<NonNullable<ListItem["unit"]>, LucideIcon> = {
	box: Box,
	bottle: Box,
	pack: ShoppingBag,
	case: Archive,
	bag: Package,
	"": Package,
};

const getCategoryIcon = (category?: ListItem["category"]) =>
	categoryIcons[category ?? ""] ?? Package;

const getUnitIcon = (unit?: ListItem["unit"]) =>
	unitIcons[unit ?? ""] ?? Package;

const ListItem: React.FC<ListItemProps> = ({ item, className }) => {
	const CategoryIcon = getCategoryIcon(item?.category);
	const UnitIcon = getUnitIcon(item?.unit);

	return (
		<li
			className={`${className} relative flex items-center gap-3 p-3 shadow-sm border-1 bg-[rgb(var(--color-accent-1))] border-[rgb(var(--color-accent-1))]`}
		>
			<CategoryIcon className="w-7 h-7 text-gray-500" />

			<div className="flex-1">
				<p className="capitalize truncate-on-wrap text-center font-semibold text-lg">
					{item?.name}
				</p>
				<p className="text-sm text-gray-500">{item?.location}</p>
			</div>

			<div className="flex gap-2 items-center">
				{item?.refrigerated && <Snowflake className="text-blue-600 w-7 h-7" />}
				{item?.unit && <UnitIcon className="w-7 h-7 text-gray-500" />}
			</div>
		</li>
	);
};

export default ListItem;
