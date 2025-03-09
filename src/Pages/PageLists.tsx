import Button from "../components/Button";
import List from "../components/List";
import ListCardGrid from "../components/ListCardGrid";
import itemState from "../store/itemStore";
import listState from "../store/listStore";

const PageLists: React.FC = () => {
	const { lists } = listState();
	const { items } = itemState();
	return (
		<div className="fade-in py-4">
			<div className="flex flex-row justify-end pr-4">
				<Button href="/lists/new" type="outline" text="New List" />
			</div>
			<ListCardGrid lists={lists} />
			<List items={items} />
		</div>
	);
};

export default PageLists;
