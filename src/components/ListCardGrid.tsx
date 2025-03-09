import Card from "./Card";

const ListCardGrid: React.FC<{ lists: List[] }> = ({ lists }) => {
	return (
		<div className="w-full max-w-screen-xl mx-auto px-4">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{lists.map((list) => (
					<Card
						key={list.id}
						list={list}
						onClick={() => console.log("Card clicked:", list.id)}
					/>
				))}
			</div>
		</div>
	);
};

export default ListCardGrid;
