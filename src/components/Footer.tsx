import { Link } from "react-router-dom";

const links = [
	{ href: "items/new", name: "Add" },
	{ href: "items/list", name: "Manage" },
];

const Footer = () => {
	return (
		<footer className="w-full py-3 bg-gray-800 text-white fixed bottom-0 flex justify-center gap-6">
			{links.map((link) => (
				<Link
					key={link.href}
					to={link.href}
					className="text-sm font-medium hover:underline hover:text-gray-300"
				>
					{link.name}
				</Link>
			))}
		</footer>
	);
};

export default Footer;
