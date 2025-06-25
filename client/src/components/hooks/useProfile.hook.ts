import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchProfile = async () => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}user/profile`,{
        withCredentials: true
        })
        // console.log("fetchprofile",data)
        return data
    } catch(error) {
        return error
    }
}

export const useProfile = (options = {}) => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
        staleTime: 1000 * 60 * 60 * 6, // 6 hours
        retry: false,
        ...options
    })
}