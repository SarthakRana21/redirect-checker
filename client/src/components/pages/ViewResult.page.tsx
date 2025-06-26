import * as xlsx from 'xlsx';
import type { redirectObject, tableData } from "../interfaces/interface";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-sm text-gray-700">
        {`Checking URL no: ${current} of ${total}`}
      </div>
    </div>
  );
};

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
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)

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

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if(response?.status == 'active') {
      interval = setInterval(() => {
       axios.get(`${import.meta.env.VITE_API_URL}job/progress/${jobid}`, {
        withCredentials: true,
      })
      .then(res => {
        // console.log(res)
        setTotal(res.data?.data?.total)
        setCurrent(res.data?.data?.current)
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(_err => {
        navigate(0)
        clearInterval(interval)
      })
      }, 5000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [jobid, navigate, response?.status])

  return (
    <div className="min-h-full w-full flex flex-col gap-10 justify-center items-center bg-gray-900 px-4 my-10">
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
            <span>{response?.createdAt ? response.createdAt : 'N/A'}</span>
          </div>
        </div>
      </div>

      {response?.status == "complete" && ResultArea(data)}
      {response?.status == "active" && <ProgressBar current={current} total={total}/>}
    </div>
  );
};
