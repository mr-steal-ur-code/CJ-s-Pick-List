import React, {
	useRef,
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import ReactDOM from "react-dom";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	closeButton?: boolean;
};

const Modal = forwardRef<ModalHandle, ModalProps>(
	({ isOpen, onClose, children, closeButton }, ref) => {
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
				className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black z-50 ${bgAnimateClass}`}
			>
				<div
					ref={modalRef}
					className={`relative p-4 bg-[rgb(var(--color-bkg2))] border-2 border-white rounded-md
          sm:w-[85vw] md:w-[450px] lg:w-[600px] ${animateClass}`}
				>
					{children}
					{closeButton && (
						<button
							className="absolute right-0 bottom-0 p-2 hover:text-primary"
							onClick={dismiss}
						>
							Dismiss
						</button>
					)}
				</div>
			</div>
		);

		return ReactDOM.createPortal(modalContent, document.body);
	}
);

export default Modal;
