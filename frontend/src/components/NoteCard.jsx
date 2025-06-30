import { Link } from "react-router-dom";
export default function NoteCard({note})
{
    return (
        <div className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition">
            <Link to={`/notes/${note.id}`}>
            <h2 className="font-semibold text-lg">{note.title}</h2>
            </Link>
            <p className="text-gray-600 mt-2">{note.content.slice(0, 100)}...</p>
            <div className="text-xs text-gray-400 mt-2">
                Tags: {note.tags?.map(t => t.name).join(', ') || 'None'}
            </div>

        </div>
    )
}