import axios from "axios";
import React, { useState, type FormEvent } from "react"
import { BarLoader } from "react-spinners";
import ExcelInstructions from "./excelInstruction";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./hooks/useProfile.hook";


const Form: React.FC = () => {
    const API_URL= `${import.meta.env.VITE_API_URL}check-redirect`

    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // console.log(e.target.files)
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async (e: FormEvent) => {

        e.preventDefault()
        if(!file) {
            alert("Please upload an excel file")
            return
        }
        setLoading(true)
        
        const formData = new FormData()
        formData.append('file', file, `${Date.now()}-${file.name}`)

        try {
            // console.log('started upalod')
            await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            })
            // console.log('finised', res.data.data)
            setLoading(false)
            navigate('/dashboard')

        } catch (error) {
            setLoading(false)
            alert("Something Went Wrong, Please try again")
            console.log(error)
            
        }
        
    }

    return (
        <form onSubmit={handleUpload} className="flex justify-center items-center flex-col gap-10">
            <div className="md:w-2/3 lg:w-1/3 border-2 h-32 border-dashed border-purple-500 rounded transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                <input
                    className="w-full h-full text-lg content-center lg:pl-[26%] pl-[35%] cursor-pointer text-purple-400" 
                    type="file" 
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}/>
            </div>
            <div>
                <button type="submit">{loading ? <BarLoader loading height={6} color="#b58eff"/> : `Check Redirect`}</button>
                
            </div>
        </form>
    )
}


const PleaseLogin: React.FC = () => {
  return (
    <div className="mt-20 flex flex-col items-center justify-center text-white px-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-purple-400 mb-4 text-center">
        Please login or register to check redirects
      </h2>
      <p className="text-gray-400 text-center max-w-md">
        You need to be authenticated to upload an Excel file and use the redirect checker tool.
      </p>
    </div>
  );
};


export default function Home() {    

    const {data:profile} = useProfile({refetch: false})
    // console.log(profile?.data)
    return (

       <div className="mt-10">
            { profile?.data == undefined ? <PleaseLogin /> : <Form />}
        
        <div className="my-10 flex justify-center items-center flex-col gap-3">
            <ExcelInstructions />
        </div>
      
       </div>
    )
}