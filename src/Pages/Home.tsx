import { useState } from "react";
import AppToaster from "../components/Toast/AppToaster";
import listState from "../store/listStore";
import List from "../components/List";

const Home: React.FC = () => {
	document.title = "CJ's Pick List";
	const { lists } = listState();
	const [currentListId, setCurrentListId] = useState("");

	const handleListSelect = async (listId: string) => {
		setCurrentListId(lists?.find((list) => list?.id === listId)?.id);
	};

	return (
		<>
			<AppToaster />
			<div className="flex flex-row flex-wrap gap-8 items-center fade-in">
				<select onChange={(e) => handleListSelect(e?.target?.value)}>
					<option>Select List</option>
					{lists?.map((list) => (
						<option key={list?.id} value={list?.id}>
							{list?.title}
						</option>
					))}
				</select>
			</div>
			{currentListId && <List listId={currentListId}></List>}
		</>
	);
};

export default Home;
