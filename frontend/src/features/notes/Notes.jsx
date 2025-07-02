    import { useState, useEffect } from "react";
    import axiosInstance from "../../api/axiosInstance";
    import { useNavigate } from "react-router-dom";
    import NoteCard from "./NoteCard";
    import socket from "../../socket";
    import toast from "react-hot-toast";
    import LoadingSpinner from "../../components/ui/LoadingSpinner";
    import TagFilter from "../../components/ui/TagFilter";
    import CreateNoteModal from "./modals/CreateNoteModal";
    import EditNoteModal from "./modals/EditNoteModal";
  

    export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState("");
    const [availableTags, setAvailableTags] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchTerm,setSearchTerm]=useState("");

    const navigate = useNavigate();

    // Fetch notes, optionally filtered by tag
    const fetchNotes = async (tag = "",search="") => {
        setLoading(true);
        try {
        const res = await axiosInstance.get(`/notes`, {
        params: {
            tag,
            search,
            },
        });
        setNotes(res.data.notes);
        } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes.");
        } finally {
        setLoading(false);
        }
    };

    // Fetch all available tags
    const fetchTags = async () => {
        try {
        const res = await axiosInstance.get("/tags");
        setAvailableTags(res.data.tags);
        } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to load tags.");
        }
    };

    // Fetch notes and tags on mount and when selectedTag changes
    useEffect(() => {
        fetchNotes(selectedTag,searchTerm);
        fetchTags();
    }, [selectedTag,searchTerm]);

    // Setup Socket.IO listeners for real-time note updates
    useEffect(() => {
        socket.on("note_created", (note) => {
        setNotes((prev) => [note, ...prev]);
        toast.success("A new note was added!");
        });

        socket.on("note_updated", (updatedNote) => {
        setNotes((prev) =>
            prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
        );
        toast.success("A note was updated!");
        });

        socket.on("note_deleted", ({ id }) => {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        toast.success("A note was deleted!");
        });

        return () => {
        socket.off("note_created");
        socket.off("note_updated");
        socket.off("note_deleted");
        };
    }, []);

    // Delete note handler
    const handleDelete = async (id) => {
        try {
        await axiosInstance.delete(`/notes/${id}`);
        setNotes((prev) => prev.filter((n) => n.id !== id));
        toast.success("Note deleted");
        } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete note");
        }
    };

    // Open edit modal for selected note
    const handleEdit = (note) => {
        setEditingNote(note);
    };

    // Update note handler (called from EditNoteModal)
    const handleUpdate = async (noteId, updatedNote) => {
        try {
        const res = await axiosInstance.put(`/notes/${noteId}`, updatedNote);
        const updated = res.data.note;
        setNotes((prev) =>
            prev.map((note) => (note.id === updated.id ? updated : note))
        );
        toast.success("Note updated");
        setEditingNote(null);
        } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update note");
        }
    };

    const handleTogglePin = async (note) => {
    try {
        const res = await axiosInstance.put(`/notes/${note.id}`, {
        pinned: !note.pinned,
        });
        const updated = res.data.note;

        setNotes((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n))
        );
        toast.success(updated.pinned ? "Note pinned!" : "Note unpinned.");
    } catch (error) {
        console.error("Pin toggle failed:", error);
        toast.error("Failed to update pin status.");
    }
    };
    return (
        <div className="p-6 max-w-4xl mx-auto">
        {/* Header and create new note button */}
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">📝 Your Notes</h1>
            <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
            + New Note
            </button>
                <input
                type="text"
                className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
        </div>

        {/* Tag Filter Dropdown */}
        <TagFilter
            selectedTag={selectedTag}
            tags={availableTags}
            onChange={setSelectedTag}
        />

        {/* Notes List or Loading/Empty States */}
        {loading ? (
            <div className="mt-6 flex justify-center">
            <LoadingSpinner />
            </div>
        ) : notes.length === 0 ? (
            <div className="text-center mt-10 text-gray-600">
                <div className="text-4xl mb-4">🗒️</div>
                {selectedTag || searchTerm ? (
                <p className="text-lg">No notes match your current filters.</p>
                ) : (
                <>
                    <p className="text-lg">You don’t have any notes yet.</p>
                    <p className="text-sm mt-2">Click the “+ New Note” button to create one.</p>
                </>
                )}
            </div>
            ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mt-6">
            {notes.slice()
                .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                .map((note) => (
                <NoteCard
                key={note.id}
                note={note}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note.id)}
                onTogglePin={handleTogglePin}
                />
            ))}
            </div>
        )}

        {/* Create Note Modal */}
        <CreateNoteModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={() => {
            setIsCreateOpen(false);
            fetchNotes(selectedTag);
            }}
            availableTags={availableTags}
        />

        {/* Edit Note Modal */}
        {editingNote && (
            <EditNoteModal
            isOpen={!!editingNote}
            note={editingNote}
            onClose={() => setEditingNote(null)}
            onUpdate={handleUpdate}
            availableTags={availableTags}
            />
        )}
        </div>
    );
    }
