import { useEffect, useState } from "react";

interface ItemFormProps {
	onSubmit: (item: ListItem) => void;
	listItem?: ListItem;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, listItem }) => {
	const [item, setItem] = useState<ListItem>({
		name: "",
		refrigerated: false,
		category: "",
		unit: "",
		tags: "",
		location: "",
	});

	useEffect(() => {
		if (listItem) {
			setItem(listItem);
		}
	}, [listItem]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;
		setItem((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleSubmit = () => {
		if (!item?.name) return alert("Item requires a name");
		if (onSubmit) onSubmit(item);
		if (!listItem) {
			setItem({
				name: "",
				refrigerated: false,
				category: "",
				unit: "",
				tags: "",
				location: "",
			});
		}
	};

	return (
		<div className="w-full flex flex-col gap-2 p-4 border rounded shadow-md">
			<input
				type="text"
				name="name"
				value={item?.name}
				placeholder="name"
				className="border p-2 rounded w-full"
				onChange={handleChange}
			/>

			<select
				name="category"
				value={item?.category}
				className="border p-2 rounded"
				onChange={handleChange}
			>
				<option value="">Select Category</option>
				<option value="grocery">Grocery</option>
				<option value="work">Work</option>
				<option value="household">Household</option>
				<option value="event">Event</option>
				<option value="other">Other</option>
			</select>

			<select
				name="unit"
				value={item?.unit}
				className="border p-2 rounded"
				onChange={handleChange}
			>
				<option value="">Select Unit</option>
				<option value="box">Box</option>
				<option value="bottle">Bottle</option>
				<option value="pack">Pack</option>
				<option value="case">Case</option>
				<option value="bag">Bag</option>
			</select>

			<input
				type="text"
				name="location"
				value={item?.location}
				placeholder="Location"
				className="border p-2 rounded w-full"
				onChange={handleChange}
			/>

			<input
				type="text"
				name="tags"
				value={item?.tags}
				placeholder="Tags (comma-separated)"
				className="border p-2 rounded w-full"
				onChange={handleChange}
			/>

			{item?.category === "grocery" && (
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						name="refrigerated"
						checked={item?.refrigerated}
						onChange={handleChange}
					/>
					Refrigerated
				</label>
			)}

			<button
				onClick={handleSubmit}
				className="bg-blue-500 text-white p-2 rounded"
			>
				Add
			</button>
		</div>
	);
};

export default ItemForm;
