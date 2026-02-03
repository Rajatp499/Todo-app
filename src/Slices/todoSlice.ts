import { createSlice } from "@reduxjs/toolkit";

// type todoProps ={
//     state: [],
//     action: {}
// }

const todoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state: any, action) => {
      const newTodo = {
        id: action.payload.id,
        name: action.payload.name,
        completed: action.payload.completed ?? false,
      };
      // console.log('action', action.payload)
      state.push(newTodo);
    },
    completedTodo: (state: any, action) => {
      const todo = state.find((t: any) => t.id === action.payload.id);
      if (todo) {
        todo.completed = true;
      }
    },
    cancelTodo: (state: any, action) => {
      return state.filter((todo: any) => todo.id !== action.payload.id);
    },
  },
});

export const { addTodo, completedTodo, cancelTodo } = todoSlice.actions;
export default todoSlice.reducer;
