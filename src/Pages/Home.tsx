import { useState } from "react";
import AppToaster from "../components/Toast/AppToaster";
import listState from "../store/listStore";
import List from "../components/List";
import userState from "../store/userStore";
import Button from "../components/Button";
import Loader from "../components/Loader";

const Home: React.FC = () => {
	document.title = "CJ's Pick List";
	const { user } = userState();
	const { lists } = listState();
	const [currentListId, setCurrentListId] = useState("");

	const handleListSelect = async (listId: string) => {
		setCurrentListId(lists?.find((list) => list?.id === listId)?.id);
	};

	return (
		<>
			<AppToaster />
			{currentListId && <List listId={currentListId}></List>}
			{user?.id ? (
				<div className="p-4 flex flex-col items-center justify-center">
					<div className="max-w-4xl w-full rounded-xl shadow-lg space-y-6">
						<div className="text-center space-y-3">
							<h5 className="text-[rgb(var(--color-secondary))]">
								Welcome to your personal dashboard
							</h5>
						</div>

						<div className="bg-[rgb(var(--color-accent-3))] rounded-lg p-6 border border-blue-100">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">
								Your Lists
							</h2>

							<div className="flex flex-wrap gap-6 items-center">
								<select
									onChange={(e) => handleListSelect(e?.target?.value)}
									className="px-4 py-2 rounded-lg  bg-[rgb(var(--color-accent-1))] border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
								>
									<option>Choose a list</option>
									{lists
										?.filter((li) => li?.category !== "recipe")
										?.map((list) => (
											<option key={list?.id} value={list?.id}>
												{list?.title}
											</option>
										))}
								</select>

								<Button href="/lists/new" text="Create New List" />
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-[rgb(var(--color-accent-4))] rounded-lg p-6">
								<h2 className="text-xl font-semibold text-gray-800 mb-3">
									Recent Activity
								</h2>
								<p className="text-gray-700">
									Your most recent updates will appear here
								</p>
							</div>

							<div className="bg-[rgb(var(--color-accent-5))] rounded-lg p-6">
								<h2 className="text-xl font-semibold text-gray-800 mb-3">
									Quick Stats
								</h2>
								<p className="text-gray-700">
									You have {lists?.length || 0} lists available
								</p>
							</div>
						</div>
					</div>
				</div>
			) : Object.keys(user).length === 0 ? (
				<div className="mt-[10vh]">
					<Loader size="lg" />
				</div>
			) : (
				<div className="flex flex-col items-center p-4 gap-8">
					<h1 className="font-extrabold">
						<span className="-mb-6 text-blue-500 block">Welcome to</span>
						<br />
						<span className="text-5xl bg-gradient-to-r from-blue-500 to-[rgb(var(--color-secondary))] text-transparent bg-clip-text">
							CJ’s Pick List
						</span>
					</h1>
					<p className="mt-2 text-lg text-[rgb(var(--color-secondary))] max-w-lg">
						Organize, track, and manage your lists effort. A smarter way to stay
						on top of your priorities.
					</p>
					<div>
						New here?
						<Button
							color="text-primary"
							type="text"
							href="/register"
							text="Create an account"
						/>
					</div>
					<div className="flex justify-center">
						<Button href="/sign-in" text="Sign In" />
					</div>
				</div>
			)}
		</>
	);
};

export default Home;
