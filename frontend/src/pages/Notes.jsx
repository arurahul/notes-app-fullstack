    import { useEffect, useState } from "react";
    import axiosInstance from "../api/axiosInstance";
    import NoteCard from "../components/NoteCard";
    import socket from "../socket";
    import LoadingSpinner from "../components/LoadingSpinner";
    export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState("");

    // Fetch notes, refetch when selectedTag changes
    useEffect(() => {
        setLoading(true);
        let url = "/notes";
        if (selectedTag) {
        url += `?tag=${selectedTag}`;
        }
        axiosInstance.get(url)
        .then(res => {
            setNotes(res.data.notes);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [selectedTag]);

    // Socket listeners remain same, but for filtered notes, consider ignoring notes out of filter
    useEffect(() => {
        socket.on("note_created", (newNote) => {
        if (!selectedTag || newNote.tags.includes(selectedTag)) {
            setNotes(prevNotes => [newNote, ...prevNotes]);
        }
        });

        socket.on("note_updated", (updatedNote) => {
        if (!selectedTag || updatedNote.tags.includes(selectedTag)) {
            setNotes(prevNotes =>
            prevNotes.map(note => (note.id === updatedNote.id ? updatedNote : note))
            );
        } else {
            // If updatedNote doesn't match filter tag, remove it from list
            setNotes(prevNotes => prevNotes.filter(note => note.id !== updatedNote.id));
        }
        });

        socket.on("note_deleted", ({ id }) => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        });

        return () => {
        socket.off("note_created");
        socket.off("note_updated");
        socket.off("note_deleted");
        };
    }, [selectedTag]);

    // Edit callback
    const handleEdit = (note) => {
        console.log("Edit note:", note);
        // Open a modal or navigate to edit page
    };

    // Delete callback
    const handleDelete = (noteId) => {
        console.log("Delete note id:", noteId);
        // Confirm and call API to delete then update state
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    };
    return (
        <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">📝 Your Notes</h1>
        {loading ? (
            <LoadingSpinner />
        ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <select
                className="mb-4 p-2 border rounded"
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
            >
                <option value="">All Tags</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                {/* Add more tag options dynamically later if needed */}
            </select>
            {notes.length > 0 ? (
                notes.map(note => <NoteCard key={note.id} note={note} onDelete={handleDelete} onEdit={handleEdit}/>)
            ) : (
                <p>No notes found.</p>
            )}
            </div>
        )}
        </div>
    );
    }
