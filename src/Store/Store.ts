import { configureStore } from "@reduxjs/toolkit";
import todoReducer from '../Slices/todoSlice'
import userReducer from '../Slices/userSlice'
import taskReducer from '../Slices/taskSlice'


const store = configureStore({
    reducer:{
        todos:todoReducer,
        user: userReducer,
        task: taskReducer,
    }
})
export default store