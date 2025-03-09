import AppToaster from "../components/Toast/AppToaster";

const Home: React.FC = () => {
	document.title = "CJ's Pick List";
	return (
		<>
			<AppToaster />
			<div className="flex flex-row flex-wrap gap-8 items-center fade-in">
				<p>Home</p>
			</div>
		</>
	);
};

export default Home;
