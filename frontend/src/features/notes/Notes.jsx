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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    // Fetch notes, optionally filtered by tag
    const fetchNotes = async (tag = "",search="",pageNum = 1) => {
        setLoading(true);
        try {
        const res = await axiosInstance.get(`/notes`, {
        params: {
            tag,
            search,
            page: pageNum,
            per_page: 6,  // You can tweak how many notes per page
            },
        });
        setNotes(res.data.notes);
        setTotalPages(res.data.total_pages);
        setPage(res.data.page); // Keep current page in sync
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
    }, [selectedTag,searchTerm,page]);

    // Setup Socket.IO listeners for real-time note updates
    useEffect(() => {
        socket.on("note_created", (note) => {
        if (page === 1) {
            setNotes((prev) => {
            const updated = [note, ...prev];
            return updated.length > 6 ? updated.slice(0, 6) : updated;
            });
            toast.success("A new note was added!");
        } else {
            toast("New note created. Go to page 1 to view it.", { icon: "🆕" });
        }
        });

        socket.on("note_updated", (updatedNote) => {
        setNotes((prev) =>
            prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
        );
        toast.success("Note updated!", { icon: "✏️" });
        }); 
        socket.on("note_deleted", ({ id }) => {
        setNotes((prev) => {
            const filtered = prev.filter((note) => note.id !== id);
            if (filtered.length === 0 && page > 1) {
            // Refetch previous page if current becomes empty
            setPage((p) => Math.max(p - 1, 1));
            }
            return filtered;
        });
        toast.success("A note was deleted!");
        });

        return () => {
        socket.off("note_created");
        socket.off("note_updated");
        socket.off("note_deleted");
        };
    }, []);

    //CreateNote
    const handleCreateNote=async (noteData) =>{
        try{
            const response=await axiosInstance.post('/notes',noteData);
            toast.success("Note created successfully");
            fetchNotes();
        }
        catch(error)
        {
            console.log("error");
            toast.error("Failed to create Note");
        }
    }

    // Delete note handler
    const handleDelete = async (id) => {
        try {
        await axiosInstance.delete(`/notes/${id}`);
        setNotes((prev) => prev.filter((n) => n.id !== id));
        toast.success("Note deleted!", { icon: "🗑️" });
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
        toast.success("Note updated!", { icon: "✏️" });
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
        toast.success(updated.pinned ? "Note pinned!" : "Note unpinned.", { icon: "📌" });
    } catch (error) {
        console.error("Pin toggle failed:", error);
        toast.error("Failed to update pin status.");
    }
    };
    return (
        <div className="p-6 max-w-4xl mx-auto">
        {/* Header and create new note button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
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
                <div className="text-center mt-10 text-gray-600">
                    <div className="text-4xl mb-4">📭</div>
                        <p className="text-lg font-medium">No notes found.</p>
                        <p className="text-sm">Try adjusting tags or search terms.</p>
                        <p className="text-sm mt-2">Click the “+ New Note” button to create one.</p>
                </div>
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
        {/* Pagination Controls */}
        {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
            <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
            Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
            <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                idx + 1 === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
                {idx + 1}
            </button>
            ))}
            <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
            Next
            </button>
        </div>
        )}
        {/* Create Note Modal */}
        <CreateNoteModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onCreate={handleCreateNote}
            onSuccess={() => {
            setIsCreateOpen(false);
            fetchNotes(selectedTag,searchTerm, page);
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
