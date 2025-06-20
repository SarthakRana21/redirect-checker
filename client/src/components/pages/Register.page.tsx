import axios from "axios";
import React, { useState } from "react";
import { useProfile } from "../hooks/useProfile.hook";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPass, setConfPass] = useState("");
    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")

    const {refetch} = useProfile({enabled: false})
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("")

        if(password !== confPass) {
            setError(true)
            return
        }
        
        setError(false)
        try {
            const registerRequest = await axios.post(
            `${import.meta.env.VITE_API_URL}user/register`,
            {
                fullName,
                email,
                password
            }, {withCredentials: true});

            console.log(registerRequest);

            if(registerRequest.status == 200) {
                refetch()
                navigate("/")
            }

        } catch (error) {
            if(axios.isAxiosError(error) && error.response?.status == 409) {
                setMessage("User already exist")
            }
            
        }
    };
    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">
                Register
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                <label htmlFor="fullName" className="block text-gray-300 mb-1">
                    Full Name
                </label>
                <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                </div>

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
                    min={8}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {error && <div className="text-red-500">Password must be same</div>}
                </div>
                <div>
                <label htmlFor="confFassword" className="block text-gray-300 mb-1">
                    Confirm Password
                </label>
                <input
                    id="confFassword"
                    type="password"
                    required
                    value={confPass}
                    onChange={(e) => setConfPass(e.target.value)}
                    placeholder="********"
                    min={8}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                </div>
                {error && <div className="text-red-500 -mt-4">Password must be same</div>}
                <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                Register
                </button>
                <div className="text-red-500">{message}</div>
            </form>
            </div>
        </div>
    );
};

export default RegisterPage;
