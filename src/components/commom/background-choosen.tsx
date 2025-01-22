import { DndContext } from "@dnd-kit/core";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastError, ToastSuccess } from "../toast";

interface ModalBgProps {
    setModalBackground: (value: boolean) => void;
    handleSelect: (image: { url: string, label: string }) => void; // New prop to pass selected image
}

const BackgroundChoosen = ({ setModalBackground, handleSelect }: ModalBgProps) => {
    const dispatch = useDispatch();
    const [imageList, setImageList] = useState([
        { url: "https://placehold.co/600x400/f28c33/white", label: "Orange" },
        { url: "https://placehold.co/600x400/79c267/white", label: "Green" },
        { url: "https://placehold.co/600x400/e868a2/white", label: "Pink" },
        { url: "https://placehold.co/600x400/678cb5/white", label: "Blue" },
        { url: "https://placehold.co/600x400/cc4360/white", label: "Rose" },
        { url: "https://placehold.co/600x400/c5d647/white", label: "Yellow" },
    ]);
    const [urlInput, setUrlInput] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleGetImageFromURL = () => {
        if (urlInput.trim()) {
            setImageList((prev) => [
                { url: urlInput.trim(), label: urlInput.trim() },
                ...prev,
            ]);
            setUrlInput(""); // Clear the input after adding
        }
    };

    const handleFile = (file: File) => {
        if (file && file.type.startsWith("image")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImageList((prev) => [
                    { url: base64String, label: file.name },
                    ...prev,
                ]);
            };
            reader.readAsDataURL(file);
            ToastSuccess({ msg: "Upload image succesfully" });
        } else {
            ToastError({ msg: "Please upload a valid image file" });
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFile(file);
    };

    const handleSelectImage = (image: { url: string, label: string }) => {
        // Call the passed handleSelect function with the selected image
        handleSelect(image);
        setModalBackground(false); // Close modal after selecting image
    };

    return (
        <div
            className="fixed flex items-center justify-center inset-0 animate-fade z-[900] w-screen h-screen bg-black/30"
            onClick={() => setModalBackground(false)}
        >
            <div
                className="p-6 bg-white rounded-2xl w-full max-w-[800px] aspect-video animate-delay-200 animate-fade-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between font-semibold">
                    Choose image
                    <Icon
                        icon="ph:x-light"
                        className="cursor-pointer"
                        fontSize={24}
                        onClick={() => setModalBackground(false)}
                    />
                </div>
                <div className="grid grid-cols-12 gap-3 mt-6">
                    <div className="col-span-7">
                        <DndContext
                            onDragEnd={(event) => {
                                const file = event.active.data.current as File | undefined;
                                if (file) handleFile(file);
                            }}
                        >
                            <div
                                onClick={() => fileRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className={`h-full cursor-pointer flex flex-1 flex-col items-center relative justify-center rounded-lg border-2 border-dashed`}
                            >
                                <div className="w-full relative h-full flex flex-col justify-center items-center z-[2]">
                                    <span className="text-slate-500">Drop file here or click to upload</span>
                                </div>
                            </div>
                            <input
                                onChange={handleInputChange}
                                type="file"
                                id="import-json-field"
                                hidden
                                ref={fileRef}
                                accept="image/*"
                            />
                        </DndContext>
                    </div>
                    <div className="col-span-5">
                        <div className="relative">
                            <label htmlFor="Search" className="sr-only"> Search </label>

                            <input
                                type="text"
                                id="Search"
                                placeholder="Image url..."
                                className="w-full rounded-md border border-gray-200 py-2.5 ps-5 pe-10 shadow-sm sm:text-sm"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                            />

                            <span className="absolute h-full inset-y-0 end-0 w-16">
                                <button
                                    type="button"
                                    className="text-white w-full h-full rounded-md bg-black hover:text-gray-100 grid place-content-center"
                                    onClick={handleGetImageFromURL}
                                >
                                    <span className="sr-only">Add</span>
                                    <span className="text-sm font-semibold">Add</span>
                                </button>
                            </span>
                        </div>

                        <ul className="overflow-y-scroll h-full max-h-72 mt-2 flex flex-col gap-2">
                            {imageList.map((image, index) => (
                                <li
                                    key={index}
                                    className="grid grid-cols-6 gap-2 border cursor-pointer hover:bg-slate-100"
                                    onClick={() => handleSelectImage(image)} // Trigger image select
                                >
                                    <div className="col-span-2 aspect-video overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={image.url}
                                            alt={image.label}
                                        />
                                    </div>
                                    <span className="col-span-4 text-sm  truncate" title={image.label}>
                                        {image.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundChoosen;
