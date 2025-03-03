import AppToaster from "../components/Toast/AppToaster";

const Home: React.FC = () => {
	return (
		<>
			<AppToaster />
			<div className="flex flex-row flex-wrap gap-8 items-center">
				<p>Home</p>
			</div>
		</>
	);
};

export default Home;
