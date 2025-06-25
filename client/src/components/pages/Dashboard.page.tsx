import React, { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile.hook";
import SimpleTable from "../table";
import axios from "axios";
import type { tableData } from "../interfaces/interface";


const Dashboard: React.FC = () => {
  
  const [data, setData ] = useState<tableData[]>([])
  const { data: profile} = useProfile();
    
  // console.log([profile])
  const user = profile?.data?.[0];
  const name = user?.fullName || "N/A";
  const email = user?.email || "N/A";

  // console.log(profile?.data[0])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}jobs`, {
      withCredentials: true
    })
    .then(response => {
      setData(response.data.data);
    })
    .catch(error => {
      console.error("Failed to fetch jobs", error);
    });
  }, []);


  return (
    <div className="min-h-full w-full flex mt-10 flex-col gap-10 justify-center items-center bg-gray-900 px-4">
      <div className="bg-gray-800 w-1/2 rounded-lg shadow-lg py-10 px-20 text-white">
        <h2 className="text-3xl font-semibold mb-6 text-center">My Profile</h2>

        <div className="space-y-4">
          <ProfileItem label="Full Name" value={name || "N/A"} />
          <ProfileItem label="Email" value={email || "N/A"} />
          
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="bg-gray-800 w-1/2 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-semibold mb-6 text-center flex justify-center items-center gap-3">History
          </h2>

          {data.length > 0 ? <SimpleTable data={data} /> : <div>No Records Found</div>}

        </div>
      </div>
    </div>
  );
};

type ProfileItemProps = {
  label: string;
  value: string;
};

const ProfileItem: React.FC<ProfileItemProps> = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-600 pb-2">
    <span className="text-gray-400">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default Dashboard;
