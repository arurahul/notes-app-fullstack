    import { useParams } from 'react-router-dom';
    import { useEffect, useState } from 'react';
    import axios from '../api/axiosInstance';
    import LoadingSpinner from '../components/ui/LoadingSpinner';
    export default function NoteEditor() {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/notes/${id}`)
        .then(res => {
            setNote(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error loading note', err);
            setLoading(false);
        });
    }, [id]);

    function handleChange(e) {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    function handleSave(){
        axios.put(`/notes/${id}`, {
        title: note.title,
        content: note.content
        }).then(() => {
        alert('Note saved!');
        }).catch(err => {
        console.error('Error saving', err);
        });
    }
    if (loading) return <LoadingSpinner />;
    if (!note) return <p className="p-4">Note not founds checks.</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
        <input
            name="title"
            value={note.title}
            onChange={handleChange}
            className="text-2xl font-bold w-full p-2 border mb-4"
        />
        <textarea
            name="content"
            value={note.content}
            onChange={handleChange}
            className="w-full h-60 p-2 border"
        />
        <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Save
        </button>
        </div>
    );
    }