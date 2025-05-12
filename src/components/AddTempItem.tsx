import { useEffect, useRef, useState } from "react";
import listState from "../store/listStore";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import ItemForm from "./ItemForm";
import generateUuidv4 from "../utils/uuidv4";

interface AddTempItemsProps {
	addTolistId: string;
}
const AddTempItem: React.FC<AddTempItemsProps> = ({ addTolistId }) => {
	const dropdownRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const { lists, updateList } = listState();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleAdd = async (item: ListItem) => {
		setIsOpen(false);

		const targetList = lists?.find((list) => list?.id === addTolistId);

		if (!targetList) return;

		const currentItems = targetList?.items || [];

		const updatedItems = [...currentItems, { ...item, id: generateUuidv4() }];

		const updatedList = {
			...targetList,
			items: updatedItems,
		};

		const res = await updateList(addTolistId, updatedList);
		toast.dismiss();
		if (res?.success) {
			toast.success("Temp Item Added", { duration: 1200 });
		} else toast.error("Error adding Temp Item");
	};

	return (
		<div className="relative">
			<button
				className="p-1 px-2 bg-blue-500 text-white rounded-sm flex items-center justify-center shadow-md cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Add recipe"
			>
				<PlusCircle size={20} />
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-10"
					onClick={() => setIsOpen(false)}
				>
					<div
						className="w-96 p-4 rounded shadow-md bg-[rgb(var(--color-bkg2))] 
                border border-[rgb(var(--color-secondary))] text-[rgb(var(--color-content))]"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="max-h-64 overflow-y-auto">
							<ItemForm onSubmit={(e: ListItem) => handleAdd(e)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddTempItem;
