import ListItem from "../../components/ListItem";
import itemState from "../../store/itemStore";

const ListItems = () => {
	const items = itemState((state) => state.items);
	return (
		<div>
			{items?.map?.((item) => (
				<ListItem key={item?.id} item={item} />
			))}
		</div>
	);
};

export default ListItems;
