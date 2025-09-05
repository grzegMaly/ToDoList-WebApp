import {useEffect, useState} from "react";
import {FaCheck, FaTrash} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {createNote, deleteNote, getNotes, updateNote} from "../store/reducers/noteReducer.js";

export const ToDoListPage = () => {

    const dispatch = useDispatch();
    const [note, setNote] = useState({
        toDoId: null,
        content: "",
        done: false,
        createdAt: null,
        updatedAt: null
    });
    const {notes} = useSelector(state => state.notes);

    useEffect(() => {
        dispatch(getNotes())
    }, [dispatch]);

    const updateContent = e => {
        setNote({...note, content: e.target.value});
    }

    const handleSubmit = e => {
        e.preventDefault();
        setNote({...note, content: note.content.trim()})
        if (note.content) {
            dispatch(createNote(note));
            setNote(prev => ({...prev, content: ""}))
        }
    }

    const handleUpdateDone = (note) => {
        dispatch(updateNote({toDoId: note.toDoId, done: !note.done}));
    }

    const handleDeleteNote = (note) => {
        dispatch(deleteNote(note));
    }

    return (
        <main className={`w-full h-screen bg-lime-300 flex justify-center items-start pt-[10vh]`}>
            <div
                className={`w-full max-w-md shadow-lg shadow-slate-500/50 bg-yellow-300 overflow-hidden ${notes.length === 0 ? 'rounded-t-md' : 'rounded-md'}`}>
                <form className={`rounded-md bg-white`} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={note.content}
                        placeholder={'Enter note'}
                        autoComplete={'off'}
                        onChange={updateContent}
                        className={`w-full p-4 text-xl font-[Ubuntu] border-none outline-none rounded-t-md`}
                    />
                </form>
                <ul className={`w-full max-h-screen overflow-y-auto divide-y-2 divide-dotted divide-purple-600`}>
                    {notes && notes.map((note) => (
                        <li
                            key={note.toDoId}
                            className={`px-4 py-2 flex justify-between items-center`}
                        >
                            <span className={`${note.done && "line-through text-slate-400"}`}>{note.content}</span>
                            <div className={`flex gap-3`}>
                                <FaCheck size={23}
                                         onClick={() => handleUpdateDone(note)}
                                         className={`text-green-600 p-1 cursor-pointer hover:text-white hover:bg-green-600 hover:rounded-sm`}/>
                                <FaTrash size={23}
                                         onClick={() => handleDeleteNote(note)}
                                         className={`text-red-600 p-1 cursor-pointer hover:text-white hover:bg-red-600 hover:rounded-sm`}/>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
