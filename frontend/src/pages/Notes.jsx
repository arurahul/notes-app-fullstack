    import {useEffect,useState} from "react"
    import axios from "../api/axiosInstance"
    import NoteCard from "../components/NoteCard"
    export default function Notes()
    {
        const [notes,setNotes]=useState([])
        const [loading,setLoading]=useState(true)
        useEffect(()=>{
            axios.get("/notes").then(res=>{
                setNotes(res.data.notes)
                setLoading(false)
            })
            .catch(err =>{
                console.log(err)
                setLoading(false)
            })
        })
        return( <>
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">📝 Your Notes</h1>
                {loading?
                (<p className="text-gray-500">Loading...</p>)
                :
                (<div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <select className="mb-4 p-2 border rounded">
                        <option value="">All Tags</option>
                        <option value="work">Work</option>
                        <option value="study">Study</option>
                    </select>
                    {notes.length > 0 ? (
                        notes.map(note => (
                        <NoteCard key={note.id} note={note} />
                        ))
                    ) : (
                        <p>No notes found.</p>
                    )}
            </div>)
                }
                </div>
        </>)
    }