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
};

const categoryIcons: Record<NonNullable<ListItem["category"]>, LucideIcon> = {
	grocery: ShoppingCart,
	work: Briefcase,
	household: Home,
	event: Calendar,
	other: Package,
	"": Package,
};

const getCategoryIcon = (category?: ListItem["category"]) =>
	categoryIcons[category ?? ""] ?? Package;

const unitIcons: Record<NonNullable<ListItem["unit"]>, LucideIcon> = {
	box: Box,
	bottle: Box,
	pack: ShoppingBag,
	case: Archive,
	bag: Package,
	"": Package,
};

const getUnitIcon = (unit?: ListItem["unit"]) =>
	unitIcons[unit ?? ""] ?? Package;

const ListItem: React.FC<ListItemProps> = ({ item }) => {
	const CategoryIcon = getCategoryIcon(item?.category);

	const UnitIcon = getUnitIcon(item?.unit);

	return (
		<li
			className={`flex items-center gap-3 p-3 border-b rounded shadow-sm ${
				item?.refrigerated ? "bg-blue-100" : "bg-[rgb(var(--color-bkg2))]"
			}`}
		>
			<CategoryIcon className="w-6 h-6 text-gray-600" />

			<div className="flex-1 text-center">
				<p className="font-semibold text-lg">{item.name}</p>
				<p className="text-sm text-gray-500">{item.location}</p>
			</div>

			<div className="flex gap-2 items-center">
				{item.unit && <UnitIcon className="w-5 h-5 text-gray-600" />}
				{item.refrigerated && <Snowflake className="text-blue-600 w-8 h-8" />}
			</div>
		</li>
	);
};

export default ListItem;
