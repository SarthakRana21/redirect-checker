import * as xlsx from 'xlsx';
import type { redirectObject, tableData } from "../interfaces/interface";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';

const ResultArea = (data: redirectObject[]) => {
  const downloadExcel = (data: redirectObject[]) => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, `redirect-checker-${Date.now()}.xlsx`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center px-4 py-8">
      <div className="w-full flex justify-evenly items-center">
        <h2 className="text-2xl font-semibold">
          Faulty Redirect Results: {data.length}
        </h2>
        <button
          onClick={() => downloadExcel(data)}
          className="download"
        >
          Download Output Excel
        </button>
      </div>

      <div className="w-full mt-7 max-w-3xl text-sm space-y-6 overflow-y-scroll max-h-[400px]">
        {data.map((item, index) => (
          <div
            key={index}
            className="w-full bg-gray-600 shadow-md rounded-2xl p-6 border border-gray-800"
          >
            <p className="text-gray-100">
              <span className="font-medium text-violet-300">Address:</span> {item.address}
            </p>
            <p className="text-gray-100">
              <span className="font-medium text-violet-300">Status Code:</span> {item.status_code}
            </p>
            <p className="text-gray-100">
              <span className="font-medium text-violet-300">Redirect URL:</span> {item.redirect_url || '—'}
            </p>
            <p className="text-gray-100">
              <span className="font-medium text-violet-300">Expected URL:</span> {item.expected_url || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ViewResult = () => {
  const { jobid } = useParams();
  const [response, setResponse] = useState<tableData>();
  const [data, setData] = useState<redirectObject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobid) return;

    axios.get(`${import.meta.env.VITE_API_URL}job/${jobid}`, {
      withCredentials: true,
    })
      .then((res) => {
        setResponse(res?.data?.data);
        setData(res?.data?.data?.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [jobid]);

  return (
    <div className="min-h-full w-full flex mt-10 flex-col gap-10 justify-center items-center bg-gray-900 px-4">
      <div className="bg-gray-800 w-1/2 rounded-lg shadow-lg py-10 px-10 text-white">
        <div className='mb-8 flex flex-row items-start justify-between'>
            <div
            onClick={() => navigate(-1)}
            className='w-24 cursor-pointer bg-black rounded text-center p-1 border border-transparent hover:border-indigo-500 transition-colors duration-200'
            >
            ← Back
            </div>
            <h2 className="text-3xl font-semibold mb-6 text-center">Details for Job #{response?.jobId}</h2>
        </div>

        <div className="space-y-4 text-base">
          <div className="flex justify-between border-b border-gray-600 pb-2">
            <span className="text-gray-400">Status:</span>
            <span>{response?.status || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-600 pb-2">
            <span className="text-gray-400">Created At:</span>
            <span>{response?.createdAt ? new Date(response.createdAt).toLocaleString() : 'N/A'}</span>
          </div>
        </div>
      </div>

      {response?.status == "complete" && ResultArea(data)}
      {response?.status == "active" && <PacmanLoader color="#ffa100" margin={2} size={25} />}
    </div>
  );
};
