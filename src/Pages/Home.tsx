import { useNavigate } from "react-router-dom";
import AppToaster from "../components/Toast/AppToaster";

const Home: React.FC = () => {
	const navigate = useNavigate();
	return (
		<>
			<AppToaster />
			<div className="flex flex-row flex-wrap gap-8 items-center">
				{["items/new"].map((link) => (
					<div
						key={link}
						className="cursor-pointer p-2 bg-blue-500 text-white rounded"
						onClick={() => navigate(`/${link}`)}
					>
						{link}
					</div>
				))}
				<p>Home</p>
			</div>
		</>
	);
};

export default Home;
