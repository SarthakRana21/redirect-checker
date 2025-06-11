import axios from "axios";
import React, { useState, type FormEvent } from "react"
import * as xlsx from 'xlsx'
import { BarLoader } from "react-spinners";


interface redirectObject {
    address: string;
    status_code: number;
    redirect_url: string;
    expected_url?: string;
}

const resutlArea = (data: redirectObject[]) => {

    const downloadExcel = (data: redirectObject[]) => {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1")
        xlsx.writeFile(workbook, `redirect-checker-${Date.now()}.xlsx`)
    }

    return (
        <div className="w-full h-full flex flex-col items-center px-4 py-8">
            <div className="w-full flex justify-evenly items-center">
                <h2 className="text-2xl font-semibold text-red-600">Faulty Redirect Results: {data.length}</h2>
                <button 
                    onClick={() => downloadExcel(data)} 
                    className="download"
                    >Download Output Excel
                </button>
            </div>
            <div className="w-full mt-8 max-w-3xl h-90 text-sm space-y-6 overflow-y-scroll transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
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

    const API_URL= "http://localhost:5000/api/v1/check-redirect"

    const [file, setFile] = useState<File | null>(null)
    const [data, setData] = useState<redirectObject[]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(false);


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
            const res = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            // console.log('finised', res.data.data)
            setLoading(false)
            setData(res.data.data)

        } catch (error) {
            setLoading(false)
            alert("Something Went Wrong, Please try again")
            console.log(error)
            
        }
        
    }
    // console.log(typeof data)

    return (

       <div className="mt-10">
         <form onSubmit={handleUpload} className="flex justify-center items-center flex-col gap-10">
            <div className="w-1/3 border-2 h-32 border-dashed border-purple-500 rounded transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                <input
                    className="w-full h-full text-lg content-center pl-[35%] cursor-pointer text-purple-400" 
                    type="file" 
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}/>
            </div>
            <div>
                <button type="submit">{loading ? <BarLoader loading height={6} color="#b58eff"/> : `Check Redirect`}</button>
                
            </div>
        </form>
        {data.length > 0 && resutlArea(data)}

       </div>
    )
}