import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(12);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else if (countdown === 0) {
			navigate("/");
		}
	}, [countdown, navigate]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
			<div className="relative">
				<div className="absolute inset-0 overflow-hidden">
					{[...Array(50)].map((_, i) => (
						<div
							key={i}
							className="absolute rounded-full bg-white"
							style={{
								width: `${Math.random() * 3 + 1}px`,
								height: `${Math.random() * 3 + 1}px`,
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
								opacity: Math.random() * 0.8 + 0.2,
								animation: `twinkle ${Math.random() * 5 + 2}s infinite`,
							}}
						/>
					))}
				</div>

				<div className="relative z-10 flex flex-col items-center">
					<h1 className="text-8xl font-bold mb-4 text-blue-400">404</h1>
					<div className="w-64 h-64 relative mb-8">
						<div className="absolute w-40 h-40 rounded-full bg-blue-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<div className="absolute w-full h-full rounded-full bg-blue-700 opacity-70 overflow-hidden">
								{[...Array(5)].map((_, i) => (
									<div
										key={i}
										className="absolute bg-blue-300 opacity-40 rounded-full"
										style={{
											width: `${Math.random() * 40 + 10}%`,
											height: `${Math.random() * 10 + 5}%`,
											top: `${Math.random() * 100}%`,
											left: `${Math.random() * 100}%`,
										}}
									/>
								))}
							</div>
						</div>

						<div
							className="absolute w-16 h-16 top-0 left-1/2 transform -translate-x-1/2 animate-bounce"
							style={{ animationDuration: "3s" }}
						>
							<div className="w-8 h-12 bg-gray-300 rounded-t-full mx-auto" />
							<div className="w-16 h-4 bg-gray-400 rounded-full mx-auto -mt-1" />
							<div className="w-6 h-2 bg-red-500 mx-auto mt-1" />
							<div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mt-1 animate-pulse" />
						</div>
					</div>

					<h2 className="text-2xl font-bold mb-4">
						Houston, We Have a Problem!
					</h2>
					<p className="text-lg mb-6 text-center max-w-md">
						The page you're looking for has drifted into deep space or never
						existed in the first place.
					</p>

					<div className="flex flex-col sm:flex-row gap-4">
						<button
							onClick={() => navigate(-1)}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Go Back
						</button>
						<button
							onClick={() => navigate("/")}
							className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
						>
							Return Home
						</button>
					</div>

					<p className="mt-8 text-gray-400">
						Auto-redirecting to home in {countdown} seconds...
					</p>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
