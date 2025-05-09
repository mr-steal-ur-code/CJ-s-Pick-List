import { Home, List, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const links = [
	{ href: "/", name: "Home", icon: <Home /> },
	{ href: "items", name: "Items", icon: <Package /> },
	{ href: "lists", name: "Lists", icon: <List /> },
];

const Footer = () => {
	const location = useLocation();
	const currentPath = location.pathname;

	return (
		<footer className="h-20 pb-2 pt-2 w-full bg-[rgb(var(--color-bkg2))] fixed bottom-0 flex flex-col items-center justify-center">
			<div className="flex flex-row items-center gap-12">
				{links.map((link) => (
					<Link
						key={link.href}
						to={link.href}
						className={`${
							(link.href === "/" && currentPath === "/") ||
							currentPath?.split("/")?.includes(link.href)
								? "text-primary"
								: ""
						} flex flex-col items-center text-sm font-medium hover:underline`}
					>
						{link?.icon && <span>{link.icon}</span>}
						{link.name}
					</Link>
				))}
			</div>
			<p className="text-xs text-gray-500 mt-2">
				Made by Kutsolutions © {new Date().getFullYear()}
			</p>
		</footer>
	);
};

export default Footer;
