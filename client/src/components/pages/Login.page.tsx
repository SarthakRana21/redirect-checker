import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile.hook";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  
  const navigate = useNavigate()

  const {refetch} = useProfile({enabled: false})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("")
    
    try {
        const loginRequest = await axios.post(`${import.meta.env.VITE_API_URL}user/login`, {
            email,
            password
        }, { withCredentials: true })
        console.log("login Reqest", loginRequest)

        if(loginRequest.status == 200) { 
         
            await refetch();
            navigate("/profile");
         
        } 
        
      } catch (error) {
          if(axios.isAxiosError(error) && error.response?.status == 401) {
            setError("Invalid Credentials")
          }
          
      };
    }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              min={8}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          { error && <div className="text-red-400">{error}</div> }
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded-md"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
