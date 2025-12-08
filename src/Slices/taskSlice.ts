import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "task",
  initialState: [],
  reducers: {
    addTask: (state: any, action) => {
      const newTask = {
        id: action.payload.$id,
        name: action.payload.title,
        todo_id: action.payload.groupId ,
        completed: action.payload.status || false,
        task_id: action.payload.parentTaskId,
      };
      state.push(newTask);
      // console.log(newTask)
    },
    completedTask: (state: any, action) => {

        // console.log(action.payload.id)
        const task = state.find((t: any) => t.id === action.payload.id);
      if (task) {
        task.completed = true;
      }
    },
    deleteAllTask:()=>{
        return []
    },
    cancelTask:(state:any, action)=>{
        return state.filter((task:any)=> task.id !== action.payload.id)
    }
  },
});

export default taskSlice.reducer;
export const { addTask, completedTask, deleteAllTask, cancelTask } = taskSlice.actions;
