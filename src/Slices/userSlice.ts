import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{id:'', name:'', email:''},
    reducers:{
        addUser:(state: any, action)=>{
            state.id = action.payload.$id ;
            state.name = action.payload.name,
            state.email = action.payload.email
            // state.password = action.payload.password 

        },
        deleteUser:(state:any)=>{
            state.id = '';
            state.userName = '',
            state.email = ''
            // state.password = '' 

        }
    }
})

export const {addUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;