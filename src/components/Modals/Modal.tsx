import React, {
	useRef,
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import ReactDOM from "react-dom";
import Button from "../Button";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	footerBtn?: React.ReactNode;
};

const Modal = forwardRef<ModalHandle, ModalProps>(
	({ isOpen, onClose, children, footerBtn }, ref) => {
		const modalRef = useRef<HTMLDivElement>(null);
		const [animateClass, setAnimateClass] = useState("");
		const [bgAnimateClass, setBgAnimateClass] = useState("");

		useEffect(() => {
			if (isOpen) {
				setBgAnimateClass("modal-bg-enter modal-bg-enter-active");
				setAnimateClass("modal-enter modal-enter-active");
				document.addEventListener("mousedown", handleClickOutside);
			} else {
				dismiss();
			}

			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isOpen]);

		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				dismiss();
			}
		};

		const dismiss = () => {
			setBgAnimateClass("modal-bg-exit modal-bg-exit-active");
			setAnimateClass("modal-exit modal-exit-active");
			setTimeout(() => {
				onClose();
			}, 400);
		};

		useImperativeHandle(ref, () => ({
			dismiss,
		}));

		if (!isOpen) return null;

		const modalContent = (
			<div
				className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 ${bgAnimateClass}`}
			>
				<div
					ref={modalRef}
					className={`relative p-4 bg-[rgb(var(--color-bkg2))] border-2 border-white rounded-md sm:w-[85vw] md:w-[450px] lg:w-[600px] max-h-[95vh] flex flex-col ${animateClass}`}
				>
					<div className="flex-grow overflow-auto p-2">{children}</div>

					<div className="border-t border-white flex justify-between items-center p-2">
						<div>{footerBtn}</div>
						<Button
							type="text"
							className="p-2 hover:text-[rgb(var(--color-danger))] cursor-pointer ml-auto"
							onClick={dismiss}
							text="Dismiss"
						/>
					</div>
				</div>
			</div>
		);

		return ReactDOM.createPortal(modalContent, document.body);
	}
);

export default Modal;
