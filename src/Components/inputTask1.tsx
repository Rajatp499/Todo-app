import { useState } from "react";
import Popup from "reactjs-popup"
import { databases, ID } from "../lib/appwrite";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addTask } from "../Slices/taskSlice";

type inputTask1Props = {
    open: boolean,
    onClose: () => void;
    todo_id: string,
}
const inputTask1 = ({ open, onClose, todo_id}: inputTask1Props) => {
    const [title, setTitle] = useState('');
    const dispatch = useDispatch();

    const submitTask =async(e:React.FormEvent)=>{
        e.preventDefault()
        try{
            const uniqueId = ID.unique();
            const res = await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
                uniqueId,
                {
                    title:title,
                    groupId:todo_id,
                    status:false,
                }
            )

            dispatch(addTask(res))
            toast.success('Sucessfully added task')
            setTitle('')
            onClose();
        }catch(err){
            console.log(err)
            toast.error('Error creating task')
        }
    }
    const close = () => {
        setTitle('')
        onClose()

    }


    return (
        <Popup open={open} onClose={onClose} modal nested>
            <form className="p-5 bg-white rounded-xl shadow-lg w-xl" onSubmit={(e)=>submitTask(e)}>
                <h2 className="text-xl font-semibold mb-4">Add Task</h2>

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

export default inputTask1