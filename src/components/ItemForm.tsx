import { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";

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
			setItem((prev) => ({
				...prev,
				...listItem,
			}));
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
		<div className="w-full flex flex-col gap-3 p-6  rounded-lg shadow-lg">
			<Input
				labelText="Name"
				labelType="floating"
				type="text"
				name="name"
				value={item?.name}
				onChange={handleChange}
			/>

			<select name="category" value={item?.category} onChange={handleChange}>
				<option value="">Select Category</option>
				<option value="grocery">Grocery</option>
				<option value="work">Work</option>
				<option value="household">Household</option>
				<option value="event">Event</option>
				<option value="other">Other</option>
			</select>

			{item?.category === "grocery" && (
				<label className="flex items-center gap-3 ">
					<input
						type="checkbox"
						name="refrigerated"
						checked={item?.refrigerated}
						onChange={handleChange}
						className="w-5 h-5 text-blue-500 focus:ring-[rgb(var(--color-secondary))] rounded-sm rounded-md"
					/>
					Refrigerated
				</label>
			)}

			<select name="unit" value={item?.unit} onChange={handleChange}>
				<option value="">Select Unit</option>
				<option value="box">Box</option>
				<option value="bottle">Bottle</option>
				<option value="pack">Pack</option>
				<option value="case">Case</option>
				<option value="bag">Bag</option>
			</select>

			<Input
				labelText="Location"
				labelType="floating"
				type="text"
				name="location"
				value={item?.location}
				onChange={handleChange}
			/>

			<Input
				labelText="Tags (comma-separated)"
				labelType="floating"
				type="text"
				name="tags"
				value={item?.tags}
				onChange={handleChange}
			/>

			<Button
				onClick={handleSubmit}
				text={item?.id ? "Save Changes" : "Add Item"}
			/>
		</div>
	);
};

export default ItemForm;
