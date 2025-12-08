import { useState } from "react";
import { Link } from "react-router-dom";
import { account } from "../lib/appwrite";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
// import { addUser } from "../Slices/userSlice";

export default function LoginPage() {
  const [email, setEmail] =useState('')
  const [password, setPassword] =useState('')

  const navigate = useNavigate();
  // const dispatch = useDispatch()


    const login =async()=>{
      try{
        const session = await account.createEmailPasswordSession(email,password)
        console.log(session)
        navigate('/')
        // window.location.reload()
        toast('Logged IN')
      }   
      catch(err){
        // console.log(err)
        toast('Invalid credentials')
      }   

    
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>

        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">email</label>
          <input
            type="text"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        onClick={()=> login()}>
          Login
        </button>

        {/* Signup Link */}
        <p className="text-center mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
