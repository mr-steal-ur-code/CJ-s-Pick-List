import { lazy, useRef, useState } from "react";
import Button from "../components/Button";
import List from "../components/List";
import AppToaster from "../components/Toast/AppToaster";
import listState from "../store/listStore";
import userState from "../store/userStore";
import capitalizeWords from "../utils/capitalizeWords";
import dateFromTimestamp from "../utils/dateFromTimestamp";
import generateUuidv4 from "../utils/uuidv4";
import toast from "react-hot-toast";
import SuspenseLoader from "../components/SuspenseLoader";
const Modal = lazy(() => import("../components/Modals/Modal"));

const Home: React.FC = () => {
	document.title = "CJ's Pick List";
	const selectRef = useRef<HTMLSelectElement>(null);
	const modalRef = useRef(null);
	const { user } = userState();
	const { lists, deleteList, resetList } = listState();
	const [currentListId, setCurrentListId] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState({
		reset: false,
		delete: false,
	});

	const handleListSelect = async (listId: string) => {
		setCurrentListId(lists?.find((list) => list?.id === listId)?.id || "");
		selectRef.current.value = "";
	};

	const newestLists = lists
		?.sort((a: any, b: any) => b?.updatedAt - a?.updatedAt)
		?.slice(0, 3)
		?.map((list) => ({
			title: capitalizeWords(list?.title),
			category: capitalizeWords(list?.category),
			updated: list?.updatedAt,
		}));

	const handleFinishedList = async () => {
		if (!currentListId) return;
		setIsOpen(true);
	};

	const handleResetList = async () => {
		setIsLoading({ reset: true, delete: false });
		const res = await resetList(currentListId);
		if (res?.success) {
			setIsLoading({ reset: false, delete: false });
			handleListSelect("");
			toast.success("List Reset");
			modalRef?.current?.dismiss();
		} else toast.error("Error Resetting List");
	};

	const handleDeleteList = async () => {
		setIsLoading({ reset: false, delete: true });
		const res = await deleteList(currentListId);
		if (res?.success) {
			setIsLoading({ reset: false, delete: false });
			handleListSelect("");
			toast.success("List Deleted");
			modalRef?.current?.dismiss();
		} else toast.error("Error Deleting List");
	};

	return (
		<div className="fade-in">
			<AppToaster />
			{isOpen && (
				<SuspenseLoader>
					<Modal
						ref={modalRef}
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
					>
						<h4>List Completed, what would you like to do?</h4>
						<div className="flex justify-between p-4">
							<Button
								type="outline"
								loading={isLoading?.reset}
								disabled={isLoading?.reset || isLoading?.delete}
								onClick={handleResetList}
								text="Reset List"
							/>
							<Button
								loading={isLoading?.delete}
								disabled={isLoading?.reset || isLoading?.delete}
								type="cancel"
								onClick={handleDeleteList}
								text="Delete List"
							/>
						</div>
					</Modal>
				</SuspenseLoader>
			)}
			{currentListId && (
				<List
					onListCompleted={handleFinishedList}
					reset={() => handleListSelect("")}
					listId={currentListId}
				></List>
			)}
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

							<div className="flex flex-wrap gap-6 items-start">
								<select
									ref={selectRef}
									onChange={(e) => handleListSelect(e?.target?.value)}
									className="px-4 py-2 rounded-lg  bg-[rgb(var(--color-accent-1))] border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
								>
									<option value="">Choose a list</option>
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
								{newestLists?.map((list) => (
									<h5 key={generateUuidv4()} className="text-gray-700">
										{list
											? `${dateFromTimestamp(list?.updated)} ${
													list?.category.toLowerCase() === "recipe"
														? list?.category
														: `${list?.category} List`
													// eslint-disable-next-line no-mixed-spaces-and-tabs
											  } ${list?.title}`
											: "Your most recent updates will appear here"}
									</h5>
								))}
							</div>

							<div className="bg-[rgb(var(--color-accent-5))] rounded-lg p-6">
								<h2 className="text-xl font-semibold text-gray-800 mb-3">
									Quick Stats
								</h2>
								<p className="text-gray-700">
									You currently have {lists?.length || 0} lists.
								</p>
								<p className="text-gray-700">
									There are{" "}
									{lists?.filter((list) => list?.category === "recipe")
										?.length || 0}{" "}
									saved recipes in your collection.
								</p>
							</div>
						</div>
					</div>
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
						Organize, track, and manage your lists effortlessly. A smarter way
						to stay on top of your priorities.
					</p>
					<div>
						New here?{" "}
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
		</div>
	);
};

export default Home;
