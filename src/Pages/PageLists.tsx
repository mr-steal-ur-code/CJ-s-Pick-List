import Button from "../components/Button";
import ListCardGrid from "../components/ListCardGrid";
import listState from "../store/listStore";

const PageLists: React.FC = () => {
	const { lists } = listState();
	return (
		<div className="fade-in py-4">
			<div className="flex flex-row justify-end pr-4">
				<Button href="/lists/new" type="outline" text="New List" />
			</div>
			<ListCardGrid lists={lists} />
		</div>
	);
};

export default PageLists;
