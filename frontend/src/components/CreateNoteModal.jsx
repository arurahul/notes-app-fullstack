    import { Dialog } from "@headlessui/react";
    import { useState } from "react";

    export default function CreateNoteModal({ isOpen, onClose, onCreate, availableTags }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        onCreate({ title, content, tags: selectedTags });
        setTitle("");
        setContent("");
        setSelectedTags([]);
        onClose();
    };

    const handleTagChange = (tag) => {
        setSelectedTags((prev) =>
        prev.includes(tag)
            ? prev.filter((t) => t !== tag)
            : [...prev, tag]
        );
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-4">Create Note</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
                <textarea
                className="w-full border px-3 py-2 rounded"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                />
                <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                    <label
                    key={tag}
                    className={`px-2 py-1 text-sm rounded cursor-pointer border ${
                        selectedTags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    >
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                    />
                    {tag}
                    </label>
                ))}
                </div>
                <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className="text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create
                </button>
                </div>
            </form>
            </Dialog.Panel>
        </div>
        </Dialog>
    );
    }
