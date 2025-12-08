import { useState } from 'react';
import Popup from 'reactjs-popup';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '../Slices/todoSlice';
import { databases, ID } from '../lib/appwrite';
import { toast } from 'react-toastify';
import { Permission, Role } from 'appwrite';
// import { Permission, Role } from 'react-native-appwrite';

type inputTodoProps = {
    open: boolean;
    onClose: () => void;
}
const inputTodo = ({ open, onClose }: inputTodoProps) => {
    const [title, setTitle] = useState('');

    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user)

    const onAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const uniqueID = ID.unique()
            await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_TODO_COLLECTION_ID,
                uniqueID,
                {
                    name: title,
                    userId: user.id,
                },
                [Permission.read(Role.user(user.id)),
                Permission.update(Role.user(user.id)),
                Permission.delete(Role.user(user.id))]
            )
            dispatch(addTodo({ id: uniqueID, name: title }))
            setTitle('')
            onClose()
        }
        catch (err) {
            toast('Error adding tasks on database')
        }
    }

    const close = () => {
        setTitle('')
        onClose()

    }

    return (
        <Popup open={open} onClose={onClose} modal nested>
            <form className="p-5 bg-white rounded-xl shadow-lg w-xl" onSubmit={onAdd}>
                <h2 className="text-xl font-semibold mb-4">Add Todo</h2>

                <textarea
                    rows={1}
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Title..."
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none 
                 focus:ring-1 focus:ring-blue-500 text-gray-700 resize-none"
                />


                {/* BUTTONS */}
                <div className="flex justify-end mt-5">
                    <button
                        type='submit'
                        className="px-4 py-2 rounded-lg bg-green-300 hover:bg-green-400 text-black font-medium mr-4"
                    >
                        Add
                    </button>

                    <button
                        className="px-4 py-2 rounded-lg bg-red-300 hover:bg-red-400 text-black font-medium"
                        onClick={() => close()}
                        type='button'
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Popup>


    )
}

export default inputTodo