import { useMemo, useState } from 'react'
import InputTodo from './inputTodo'
import TaskPopUp from './taskPopUp'

import { useSelector, useDispatch } from 'react-redux'
import { cancelTodo, completedTodo } from '../Slices/todoSlice'
import { databases } from '../lib/appwrite'
import { toast } from 'react-toastify'
import { Query } from 'appwrite'
// import { Query } from 'react-native-appwrite';

const Body = () => {
  const [inputPopUp, setInputPopUp] = useState<boolean>(false)
  const [taskPopUp, setTaskPopUp] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const dispatch = useDispatch()
  const todos = useSelector((state: any) => state.todos)

  const filteredTodos = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return todos
    return todos.filter((t: any) => t.name?.toLowerCase().includes(q))
  }, [todos, search])

  const totalCount = todos.length
  const completedCount = todos.filter((t: any) => t.completed).length

  const doneTodo = async (e: any, id: any) => {
    e.stopPropagation()
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_TODO_COLLECTION_ID,
        id,
        { status: true }
      )
      dispatch(completedTodo({ id }))
      toast.success('Task completed')
    } catch (err) {
      toast.error('Error completing task')
    }
  }

  const deleteTodo = async (e: any, id: any) => {
    e.stopPropagation()
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_TODO_COLLECTION_ID,
        id
      )
      // delete all tasks with todo_id == id
      const res = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
        [Query.equal('parentTaskId', id)]
      )
      const tasks = res.documents
      for (const task of tasks) {
        await databases.deleteDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_TASK_COLLECTION_ID,
          task.$id
        )
      }
      dispatch(cancelTodo({ id }))
      toast.info('Todo deleted')
    } catch (err) {
      console.log('Error deleting Todo', err)
      toast.error('Error deleting todo')
    }
  }

  return (
    <>
      {/* Header */}
      <div className="ml-28 mr-28 mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Todos</h1>
          <p className="text-sm text-gray-500">
            {totalCount} total • {completedCount} completed
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search todos..."
              className="pl-3 pr-10 py-2 rounded-md border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 transition w-64"
              aria-label="Search todos"
            />
            <svg
              className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
            </svg>
          </div>
        </div>
      </div>

      {/* List Container */}
      <div className={`ml-28 mr-28 mt-4 w-auto bg-navbar max-h-[72vh] rounded-sm overflow-y-auto ${todos.length === 0 ? 'p-12 flex items-center justify-center' : 'p-6'}`}>
        {filteredTodos.length === 0 ? (
          <div className="text-center text-gray-600">
            <div className="mb-4">
              <svg className="mx-auto w-24 h-24 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">No todos yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first todo to get started.</p>
            <button
              onClick={() => setInputPopUp(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
            >
              Add Todo
            </button>
          </div>
        ) : (
          filteredTodos.map((todo: any) => (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-white p-4 mb-3 rounded-md shadow-sm hover:shadow-md cursor-pointer transition transform hover:-translate-y-0.5"
              onClick={() => {
                setSelectedId(todo.id)
                setTaskPopUp(true)
              }}
            >
              {/* Left indicator + title */}
              <div className="flex items-center gap-4">
                <div className={`w-1 h-12 rounded ${todo.completed ? 'bg-gray-300' : 'bg-green-400'}`} />
                <div>
                  <p className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {todo.name}
                  </p>
                  {todo.description && <p className="text-sm text-gray-500 mt-1">{todo.description}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {!todo.completed && (
                  <button
                    onClick={(e) => doneTodo(e, todo.id)}
                    title="Mark as done"
                    aria-label="Mark as done"
                    className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Done</span>
                  </button>
                )}

                <button
                  onClick={(e) => deleteTodo(e, todo.id)}
                  title="Delete todo"
                  aria-label="Delete todo"
                  className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7v10m6-10v10M10 7l1-2h2l1 2" />
                  </svg>
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="mt-4 flex items-center justify-end h-16 rounded-md w-full">
        <button
          aria-label="Add todo"
          onClick={() => setInputPopUp((s) => !s)}
          className="rounded-full fixed right-10 bottom-10 bg-green-500 h-14 w-14 flex items-center justify-center text-3xl text-white font-semibold shadow-lg hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          +
        </button>
      </div>

      <InputTodo open={inputPopUp} onClose={() => setInputPopUp(false)} />
      {taskPopUp && <TaskPopUp open={taskPopUp} onClose={() => setTaskPopUp(false)} todo_id={selectedId} />}
    </>
  )
}

export default Body