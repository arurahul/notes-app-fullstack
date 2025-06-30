    import React from "react";

    export default function NoteCard({ note, onEdit, onDelete }) {
    // Format created date nicely
    const createdDate = new Date(note.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 cursor-pointer relative"
        onClick={() => onEdit(note)}
        title="Click to edit"
        >
        <h2 className="text-xl font-semibold mb-2 truncate">{note.title}</h2>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{note.content}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
            {note.tags.map((tag) => (
            <span
                key={tag.id || tag.name}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                title={tag.name}
            >
                #{tag.name}
            </span>
            ))}
        </div>

        {/* Created Date */}
        <div className="text-gray-400 text-xs mb-3">{createdDate}</div>

        {/* Action Buttons */}
        <div
            className="absolute top-2 right-2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent parent click event
        >
            <button
            onClick={() => onEdit(note)}
            className="p-1 rounded-full hover:bg-blue-200"
            aria-label="Edit Note"
            title="Edit Note"
            >
            ✏️
            </button>
            <button
            onClick={() => onDelete(note.id)}
            className="p-1 rounded-full hover:bg-red-200"
            aria-label="Delete Note"
            title="Delete Note"
            >
            🗑️
            </button>
        </div>
        </div>
    );
    }
