import axios from "axios";
import React, { useState, type FormEvent } from "react"


interface redirectObject {
    address: string;
    status_code: number;
    redirect_url: string;
    expected_url?: string;
}

const resutlArea = (data: redirectObject[]) => {
    return (
        <div className="w-full h-full flex flex-col items-center px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-red-600">Faulty Redirect Results: {data.length}</h2>

            <div className="w-full max-w-3xl h-90 space-y-6 overflow-y-scroll">
                {data.map((item, index) => (
                <div
                    key={index}
                    className="w-full bg-red-200 shadow-md rounded-2xl p-6 border border-gray-200">
                    <p className="text-gray-700"><span className="font-medium">Address:</span> {item.address}</p>
                    <p className="text-gray-700"><span className="font-medium">Status Code:</span> {item.status_code}</p>
                    <p className="text-gray-700"><span className="font-medium">Redirect URL:</span> {item.redirect_url || '—'}</p>
                    <p className="text-gray-700"><span className="font-medium">Expected URL:</span> {item.expected_url || '—'}</p>
                </div>
                ))}
            </div>
        </div>

    )
}

export default function Home() {    

    const API_URL= 'http://localhost:5000/api'

    const [file, setFile] = useState<File | null>(null)
    const [data, setData] = useState<redirectObject[]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [status, setStatus] = useState<string>('');

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

        const formData = new FormData()
        formData.append('file', file, `${Date.now()}-${file.name}`)

        try {
            // console.log('started upalod')
            const res = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            // console.log('finised', res.data.data)
            setData(res.data.data)

        } catch (error) {
            alert("Something Went Wrong, Please try again")
            console.log(error)
        }
        
    }
    // console.log(typeof data)

    return (

       <div className="mt-10">
         <form onSubmit={handleUpload} className="flex justify-center items-center flex-col gap-10">
            <div className="w-1/3 border-2 h-32 border-dashed border-purple-500 rounded">
                <input
                    className="w-full h-full text-center cursor-pointer text-green-100" 
                    type="file" 
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}/>
            </div>
            <button type="submit">Check Redirect</button>
        </form>
        {data.length > 0 && resutlArea(data)}

       </div>
    )
}