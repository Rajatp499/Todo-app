import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/LoginPage";
import TodoPage from "./Pages/todoPage";
import Signup from "./Pages/SignUpPage";
import { account, databases } from "./lib/appwrite";
import { addUser } from "./Slices/userSlice";
import { useDispatch } from "react-redux";
import { addTodo } from "./Slices/todoSlice";
import { ToastContainer } from "react-toastify";
export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        dispatch(addUser(currentUser))
      } catch (err) {
        console.log(err)
      }
    };

    const fetchTodo = async()=>{
      try{
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_TODO_COLLECTION_ID,
        )
        const documents= response.documents
        // console.log('documents', documents)
        documents.map((doc)=> 
          dispatch(addTodo({id:doc.$id, name:doc.name, completed:doc.status}))
        // console.log(doc.$id)
      )
        
      }
      catch(err){
        console.log('Error Loading Todos')
      }
    }

    fetchUser();
    fetchTodo();
  }, []);


  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}
