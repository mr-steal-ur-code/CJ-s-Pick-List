import { FC, useEffect, useState } from "react";
import { User } from "lucide-react";

interface AvatarProps {
	imageUrl?: string | null;
	height?: string;
	width?: string;
	onClick?: () => void;
}

const Avatar: FC<AvatarProps> = ({ imageUrl, height, width, onClick }) => {
	const [scaling, setScaling] = useState("");

	useEffect(() => {
		if (imageUrl) return;
		const interval = setInterval(() => {
			setScaling("scale");
			const timeout = setTimeout(() => {
				setScaling("");
			}, 5400);
			return () => clearTimeout(timeout);
		}, 10000);
		return () => {
			clearInterval(interval);
		};
	}, [imageUrl]);

	return (
		<div className="cursor-pointer" onClick={onClick && onClick}>
			{imageUrl ? (
				<img
					height={height || "50px"}
					width={width || "50px"}
					className="rounded-full"
					alt="avatar"
					src={imageUrl}
					referrerPolicy="no-referrer"
				/>
			) : (
				<User className={`rounded-full ${scaling}`} size={45} />
			)}
		</div>
	);
};

export default Avatar;
