    import { Dialog } from "@headlessui/react";
    import { useState, useEffect,useRef } from "react";

    export default function EditNoteModal({ isOpen, onClose, note, onUpdate, availableTags=[] }) {
    const [title, setTitle] = useState(note.title || "");
    const [content, setContent] = useState(note.content || "");
    const [isPinned, setIsPinned] = useState(note.pinned);
    const [selectedTags, setSelectedTags] = useState(note.tags || []);
    const titleRef = useRef(null);
    // Keep modal in sync if note prop changes
    useEffect(() => {
        if (note) {
        setTitle(note.title || "");
        setContent(note.content || "");
        setIsPinned(note.pinned);
             // Convert note.tags (array of tag names) to tag objects from availableTags
        const matched = availableTags.filter(tag => note.tags.includes(tag.name));
        setSelectedTags(matched);
        }
    }, [note,availableTags]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        onUpdate(note.id, { title, content, tags: selectedTags,pinned:isPinned });
        onClose();
    };

    useEffect(() => {
    if (isOpen) titleRef.current?.focus();
    }, [isOpen]);
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-4">Edit Note</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Title"
                value={title}
                ref={titleRef}
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
                    key={tag.id}
                    className={`px-2 py-1 text-sm rounded cursor-pointer border ${
                        selectedTags.some(t => t.name === tag.name)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    >
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedTags.some(t => t.name === tag.name)}
                        onChange={(e) => {
                            if (e.target.checked) {
                            setSelectedTags(prev => [...prev, tag]);
                            } else {
                            setSelectedTags(prev => prev.filter(t => t.name !== tag.name));
                            }
                        }}
                    />
                    {tag.name}
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
                    Update
                </button>
                </div>
            </form>
            </Dialog.Panel>
        </div>
        </Dialog>
    );
    }
