    import { useState } from "react";
    import { Dialog } from "@headlessui/react";

    export default function NoteCard({ note, onDelete, onEdit }) {
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

    const handleDelete = async () => {
        try {
        await onDelete(note.id);
        setIsDeleteConfirm(false);
        } catch {
        // error handled by parent onDelete
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 relative border">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{note.content}</p>

        <div className="mt-3 text-sm flex gap-2 flex-wrap">
            {(note.tags || []).map((tag) => (
            <span
                key={typeof tag === "string" ? tag : tag.id || tag.name}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
            >
                {typeof tag === "string" ? tag : tag.name}
            </span>
            ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
            <button
            className="text-blue-600 hover:underline focus:outline-none"
            onClick={() => onEdit(note)}
            aria-label={`Edit note titled ${note.title}`}
            >
            Edit
            </button>

            <button
            className="text-red-600 hover:underline focus:outline-none"
            onClick={() => setIsDeleteConfirm(true)}
            aria-label={`Delete note titled ${note.title}`}
            >
            Delete
            </button>
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog
            open={isDeleteConfirm}
            onClose={() => setIsDeleteConfirm(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded p-6 w-full max-w-sm">
                <Dialog.Title className="font-semibold text-lg">
                Delete this note?
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-600">
                This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={() => setIsDeleteConfirm(false)}
                    className="px-4 py-2 rounded border"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                    Delete
                </button>
                </div>
            </Dialog.Panel>
            </div>
        </Dialog>
        </div>
    );
    }
