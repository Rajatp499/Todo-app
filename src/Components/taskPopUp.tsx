import Popup from 'reactjs-popup'
import InputTask1 from './inputTask1';
import { useEffect, useState } from 'react';
import { databases } from '../lib/appwrite';
import { toast } from 'react-toastify';
import { ID, Query } from 'appwrite';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, cancelTask, completedTask, deleteAllTask } from '../Slices/taskSlice';

type taskPopUpProps = {
    open: boolean,
    onClose: () => void;
    todo_id: string
}

const taskPopUp = ({ open, onClose, todo_id }: taskPopUpProps) => {
    const [todo, setTodo] = useState<any>();
    const dispatch = useDispatch();
    const [inputPopUp, setInputPopUp] = useState<boolean>(false)
    const [showInput, setShowInput] = useState<boolean>(false)
    const [showInputId, setShowInputId] = useState('')
    const [inputValue, setInputValue] = useState<string>('')

    const tasks = useSelector((state: any) => state.task)

    useEffect(() => {
        if (!todo_id) return;
        const fetchTodo = async () => {
            try {
                const res = await databases.getDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_TODO_COLLECTION_ID,
                    todo_id
                );
                setTodo(res)
            } catch (err) {
                toast("Error fetching todo:");
            }
        }
        const fetchTask = async () => {
            try {
                const res = await databases.listDocuments(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
                    [Query.equal('groupId', todo_id)]
                )
                const docs = res.documents
                // console.log(docs)
                dispatch(deleteAllTask())
                docs.map((t: any) => dispatch(addTask(t)))
                // console.log(docs)
            } catch (err) {
                toast.error('Error loading tasks')
            }
        }
        fetchTodo();
        fetchTask()
    }, [todo_id])

    const doneTask = async (id: any) => {
        try {
            await databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
                id,
                { 'status': true }
            )
            dispatch(completedTask({ id }))
            toast.success('Task completed')
        } catch (err) {
            toast.error("Error completing task")
        }
    }
    const deleteTask = async (id: any) => {
        try {
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
                id
            )
            dispatch(cancelTask({ id }))

            // delete subtasks of the deleted task
            const res = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
                [Query.equal("parentTaskId", id)]
            );
            const tasks = res.documents;
            for (const task of tasks) {
                await databases.deleteDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
                    task.$id
                );
            }
            toast.success('Cancelled task')
        } catch (err) {
            toast.error('Error canceling task')
        }
    }

    const addTask2 = (id: any) => {
        setShowInput(!showInput)
        setShowInputId(id)
    }
    const handleDone = async (id: any) => {
        if (!inputValue.trim()) return;
        try {
            const uniqueId = ID.unique();
            const res = await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
                uniqueId,
                {
                    title: inputValue,
                    groupId: todo_id,
                    status: false,
                    parentTaskId: id
                }
            )
            dispatch(addTask(res))
            setShowInput(false)
            setShowInputId('')
            setInputValue("");
        } catch (err) {
            toast.error('Error adding Task')
        }
    }
    console.log(tasks)

    // UI helpers
    const allTasksForTodo = tasks.filter((t: any) => t.todo_id === todo_id)
    const totalCount = allTasksForTodo.length
    const completedCount = allTasksForTodo.filter((t: any) => t.completed).length
    const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

    return (
        <Popup open={open} onClose={onClose} modal nested>
            <div className="p-5 bg-white rounded-xl shadow-xl max-w-3xl w-[90vw] mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 gap-4">
                    <div>
                        <h2 className={`text-2xl font-bold ${todo?.completed ? "line-through text-gray-700" : "text-gray-900"}`}>
                            {todo ? todo.name : "Loading..."}
                        </h2>
                        {todo?.description && <p className="text-sm text-gray-500 mt-1">{todo.description}</p>}
                        <div className="mt-3">
                            <div className="text-xs text-gray-600 mb-1">Progress · {completedCount}/{totalCount}</div>
                            <div className="w-72 sm:w-96 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600 mr-2 hidden sm:block">Tasks: {totalCount}</div>
                        <button
                            aria-label="Close"
                            onClick={onClose}
                            className="p-2 rounded-md hover:bg-gray-100 transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                {!todo ? (
                    // Skeleton loader
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                        <div className="h-36 bg-gray-100 rounded" />
                    </div>
                ) : (
                    <>
                        <div className="space-y-3 mb-5">
                            {tasks.filter((t: any) => (t.task_id == '' || t.task_id == null) && t.todo_id === todo_id).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No tasks yet. Add a task to get started.
                                </div>
                            )}

                            {tasks.filter((t: any) => (t.task_id == '' || t.task_id == null) && t.todo_id === todo_id).map((task: any) => {
                                const key = task.id ?? task.$id
                                return (
                                    <div
                                        key={key}
                                        className="flex flex-col justify-between bg-navbar p-4 rounded-md shadow hover:shadow-md transition"
                                    >
                                        <div className='flex items-center justify-between w-full mb-2'>
                                            <div>
                                                {task.completed ? (
                                                    <p className='line-through text-md font-semibold text-gray-700'>{task.name}</p>
                                                ) : (
                                                    <p className='text-md font-semibold text-gray-900'>{task.name}</p>
                                                )}
                                            </div>

                                            <div className="flex ml-4 gap-2">
                                                <button
                                                    className="px-2 py-1 bg-green-800 text-white font-semibold rounded-md hover:bg-green-700 transition"
                                                    onClick={() => addTask2(task.id ?? task.$id)}
                                                    title="Add subtask"
                                                >
                                                    ➕ Add
                                                </button>
                                                {!task.completed && <button
                                                    className="px-2 py-1 bg-green-500 text-white font-semibold rounded-md hover:bg-green-400 transition"
                                                    onClick={() => doneTask(task.id ?? task.$id)}
                                                    title="Mark done"
                                                >
                                                    ✅ Done
                                                </button>}
                                                <button
                                                    className="px-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-400 transition"
                                                    onClick={() => deleteTask(task.id ?? task.$id)}
                                                    title="Delete task"
                                                >
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        </div>

                                        {(showInput && showInputId == (task.id ?? task.$id)) && (
                                            <div className="mt-2 ml-6 flex justify-end gap-2">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    className="border rounded w-full sm:w-96 p-2"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    placeholder="Enter subtask..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleDone(task.id ?? task.$id)
                                                    }}
                                                    aria-label="Add subtask input"
                                                />
                                                <button
                                                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-400 transition"
                                                    onClick={() => handleDone(task.id ?? task.$id)}
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        )}

                                        <div className={`mt-4 space-y-2 bg-gray-50 rounded-md shadow-inner p-2`}>
                                            {tasks.filter((t: any) => t.task_id == (task.id ?? task.$id)).map((itask: any) => {
                                                const ikey = itask.id ?? itask.$id
                                                return (
                                                    <div className='flex flex-row justify-between items-center p-2' key={ikey}>
                                                        <div className={`${itask.completed ? 'line-through text-gray-600' : 'text-gray-800'}`}>
                                                            {itask.name}
                                                        </div>
                                                        <div className='space-x-2'>
                                                            {!itask.completed && <button
                                                                className={`px-2 py-1 bg-green-500 text-white font-semibold rounded-md hover:bg-green-400 transition`}
                                                                onClick={() => doneTask(itask.id ?? itask.$id)}
                                                            >
                                                                ✅
                                                            </button>}
                                                            <button
                                                                className="px-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-400 transition"
                                                                onClick={() => deleteTask(itask.id ?? itask.$id)}
                                                            >
                                                                🗑
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className="px-4 py-2 cursor-pointer rounded-lg bg-green-400 hover:bg-green-500 text-black font-medium transition"
                                onClick={() => setInputPopUp(true)}
                            >
                                + Add Task
                            </div>
                            <div className="text-sm text-gray-500">Tip: Click "Add" on an item to create subtasks.</div>
                        </div>
                    </>
                )}
            </div>

            <InputTask1 open={inputPopUp} onClose={() => setInputPopUp(false)} todo_id={todo_id} />
        </Popup>
    )
}

export default taskPopUp