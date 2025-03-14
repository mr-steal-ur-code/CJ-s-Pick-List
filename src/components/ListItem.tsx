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
import ModalItemEdit from "./Modals/ModalItemEdit";
import { useState } from "react";

type ListItemProps = {
	item: ListItem;
	className?: string;
	isEditable?: boolean;
	canToggle?: boolean;
	showQty?: boolean;
	onToggleComplete?: () => void;
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

const ListItem: React.FC<ListItemProps> = ({
	item,
	className,
	isEditable,
	canToggle,
	showQty,
	onToggleComplete,
}) => {
	const [toggleModal, setToggleModal] = useState(false);
	const [clickDisabled, setClickDisabled] = useState(false);
	const CategoryIcon = getCategoryIcon(item?.category);
	const UnitIcon = getUnitIcon(item?.unit);

	const handleDebounceClose = () => {
		setToggleModal(false);
		setClickDisabled(true);
		setTimeout(() => setClickDisabled(false), 300);
	};

	const handleToggleModal = () => {
		if (!clickDisabled) {
			setToggleModal(true);
		}
	};

	return (
		<li
			onClick={
				isEditable ? handleToggleModal : onToggleComplete && onToggleComplete
			}
			className={`${className} ${
				isEditable || (canToggle && !item?.completed)
					? "cursor-pointer hover:bg-[rgb(var(--color-accent-2))] transition-all duration-100"
					: item?.completed
					? "cursor-pointer bg-gray-400 line-through text-gray-500 hover:bg-gray-300"
					: ""
			} relative flex items-center gap-3 p-3 shadow-sm border-1 bg-[rgb(var(--color-accent-1))] border-[rgb(var(--color-accent-1))]`}
		>
			<CategoryIcon className="w-7 h-7 text-gray-500" />

			<div className="flex-1">
				<p className="capitalize truncate-on-wrap text-center font-semibold text-lg">
					{item?.name}
					{showQty && (
						<span className="text-[rgb(var(--color-secondary))] ml-2">
							({item?.quantity})
						</span>
					)}
				</p>
				<p className="text-sm text-gray-500">{item?.location}</p>
			</div>
			<ModalItemEdit
				itemId={item?.id}
				isOpen={toggleModal}
				onClose={handleDebounceClose}
			/>
			<div className="flex gap-2 items-center">
				{item?.refrigerated && <Snowflake className="text-blue-600 w-7 h-7" />}
				{item?.unit && <UnitIcon className="w-7 h-7 text-gray-500" />}
			</div>
		</li>
	);
};

export default ListItem;
