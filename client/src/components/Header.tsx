import { useProfile } from "./hooks/useProfile.hook"
import { LoginButton, MyAccountButton, RegisterButton } from "./buttons.list";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient()

const LogoutButton: React.FC = () => {

    const {refetch} = useProfile({enabled: false})
    const navigate = useNavigate()

    const handleClick = async () => {
        await axios.post(`${import.meta.env.VITE_API_URL}user/logout`, {},{ withCredentials: true
        })
        queryClient.clear()
        refetch()
        navigate('/login')
        // console.log("loggedout")
    }

    return (
        <div className="fled cursor-pointer justify-center items-center px-6 py-2 text-white rounded-xl text-sm font-medium text-white bg-gradient-to-r from-slate-700 to-slate-600 shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-600" 
        onClick={handleClick}>
            Logout
        
        </div>
    )
}  

export default function Header() {
    const { data: profile } = useProfile({enabled: true});

    // console.log(profile?.data)

    return (
        <div className="w-full py-4 flex justify-center bg-gray-900 items-center border-b border-purple-600">
            <div className="w-[80%] flex justify-between items-center">
                <h2 className="font-semibold text-2xl pointer">
                    <Link to="/" className="text-gray-50">
                        Redirect Checker Web
                    </Link>
                </h2>
                <div className="flex items-center justify-between gap-4">
                    { profile?.data ? 
                    (
                        <>
                            <MyAccountButton />
                            <LogoutButton /> 
                        </> 
                    )
                    
                    : (
                        <>
                            <LoginButton />
                            <RegisterButton />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}