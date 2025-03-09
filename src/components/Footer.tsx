import { Link } from "react-router-dom";
import { Home, Package, List } from "lucide-react";

const links = [
	{ href: "/", name: "Home", icon: <Home /> },
	{ href: "items", name: "Items", icon: <Package /> },
	{ href: "lists", name: "Lists", icon: <List /> },
];

const Footer = () => {
	return (
		<footer className="h-16 w-full bg-[rgb(var(--color-bkg2))] fixed bottom-0 flex justify-center gap-6">
			<div className="flex flex-row items-center gap-12">
				{links.map((link) => (
					<Link
						key={link.href}
						to={link.href}
						className="flex flex-col items-center p-2 text-sm font-medium hover:underline"
					>
						{link?.icon && <span>{link.icon}</span>}
						{link.name}
					</Link>
				))}
			</div>
		</footer>
	);
};

export default Footer;
