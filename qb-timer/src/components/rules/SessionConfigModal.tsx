// SessionConfigModal.tsx
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import AddSessionModal from "./AddSessionModal.tsx";

// dnd‑kit imports
import {
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem.tsx";
import { processJsonFile } from "../../utils/SessionJsonUtil.ts";

// Import js-cookie to store updated arrangement in user cookies.
import Cookies from "js-cookie";

interface SessionConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SessionConfigModal({
                                               isOpen,
                                               onClose,
                                           }: SessionConfigModalProps) {
    const [jsonFile, setJsonFile] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Helper function: add a unique stable id to each item if not already provided.
    const addUniqueIds = (items: any[]) =>
        items.map((item, index) => {
            if (!item.id) {
                // Generate a unique id using index and a random string.
                return { ...item, id: `session-${index}-${Math.random().toString(36).substring(2, 8)}` };
            }
            return item;
        });

    // Handle file drop using react-dropzone.
    const onDrop = useCallback((acceptedFiles: File[]) => {
        processJsonFile(
            acceptedFiles,
            setJsonFile,
            (json) => {
                const newData = addUniqueIds(json);
                setData(newData);
            },
            setShowError,
            setErrorMessage
        );
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // Set up dnd‑kit sensors for pointer interactions.
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Handler for drag end using dnd‑kit API.
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = data.findIndex((item) => item.id === active.id);
            const newIndex = data.findIndex((item) => item.id === over.id);
            const newData = arrayMove(data, oldIndex, newIndex);
            setData(newData);
            // Update cookie with the latest arrangement.
            Cookies.set("sessionArrangement", JSON.stringify(newData), { expires: 7 });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-md shadow-md w-11/12 max-w-2xl relative">
                <button
                    className="absolute top-2 right-2 text-gray-600"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p>Drag and drop a .json file here, or click to select a file</p>
                </div>
                {showError && <p className="text-red-500">{errorMessage}</p>}
                <div className="flex justify-between items-center mt-4">
                    <h2 className="text-lg font-bold">
                        JSON File: {jsonFile || "No file selected"}
                    </h2>
                    <button
                        className="px-4 py-2 bg-blue-500 text-black rounded"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add
                    </button>
                </div>
                {/* dnd‑kit context for sortable list */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={data.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="mt-4">
                            {data.map((item) => (
                                <SortableItem key={item.id} id={item.id} sessionData={item} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                {isAddModalOpen && (
                    <AddSessionModal
                        setIsModalOpen={setIsAddModalOpen}
                        setData={setData}
                    />
                )}
            </div>
        </div>
    );
}
