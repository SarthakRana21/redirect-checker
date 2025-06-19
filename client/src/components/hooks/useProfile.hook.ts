import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProfile = async () => {
        
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}user/profile`)

    return data
}

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
        staleTime: 1000 * 60 * 60 * 6, // 6 hours
        retry: false,
    })
}