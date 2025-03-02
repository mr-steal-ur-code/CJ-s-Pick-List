import { useEffect, useRef, useState, type ChangeEvent } from "react";
import ErrorMessage from "./ErrorMessage";
import Button from "./Button";
import { MdClear } from "react-icons/md";

type PhotoUploadProps = {
	onChange?: (file: File) => void;
	trigger?: string;
	error?: string;
	value?: string;
	hidePreview?: boolean;
	resetRef?: React.MutableRefObject<() => void | null>;
};
const PhotoUpload: React.FC<PhotoUploadProps> = ({
	onChange,
	trigger,
	error,
	value,
	hidePreview,
	resetRef,
}) => {
	const fileInputEl = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [fileName, setFileName] = useState("");

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setFileName(file.name || "No Image Name");
			const imageUrl = URL.createObjectURL(file);
			setPreviewUrl(imageUrl);
			onChange && file && onChange(file);
		}
	};

	useEffect(() => {
		if (resetRef) {
			resetRef.current = () => {
				clear();
			};
		}
	}, [resetRef]);

	const clear = () => {
		setPreviewUrl(null);
		setFileName("");
		if (fileInputEl.current) {
			fileInputEl.current.value = "";
		}
	};

	return (
		<>
			<div className="flex flex-col items-center my-4">
				{!hidePreview && previewUrl && (
					<img
						className="fade-in sm:max-w-[100px] md:max-w-[200px]"
						src={previewUrl}
						alt="Preview"
					/>
				)}
				{hidePreview && fileName && (
					<div className="flex flex-row gap-4 items-center">
						<p className="text-success text-wrap break-words max-w-[60vw] p-2">
							{fileName}
						</p>
						<MdClear
							onClick={() => {
								if (!confirm("Clear selected Image?")) return;
								clear();
							}}
							className="inline-block text-danger ml-4 mb-8 cursor-pointer hover:text-opacity-50"
							size={40}
						/>
					</div>
				)}
				{error && <ErrorMessage error={error} />}
				<Button
					className="w-full"
					type={error ? "cancel" : "outline"}
					onClick={() => fileInputEl?.current?.click()}
					text={trigger || "Select Image"}
				/>
				<input
					className="hidden"
					defaultValue={value}
					ref={fileInputEl}
					type="file"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						if (e.target.files != null) handleFileChange(e);
					}}
				/>
			</div>
		</>
	);
};

export default PhotoUpload;
