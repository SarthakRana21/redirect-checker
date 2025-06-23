import React from "react";
import { useProfile } from "../hooks/useProfile.hook";

const Dashboard: React.FC = () => {
  const { data: profile} = useProfile();
    
  console.log([profile])
  const name = profile?.data[0]?.fullName
  const email = profile?.data[0]?.email

//   console.log(profile?.data[0])

  return (
    <div className="min-h-[70vh] flex justify-center items-center bg-gray-900 px-4">
      <div className="bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-3xl font-semibold mb-6 text-center">My Profile</h2>

        <div className="space-y-4">
          <ProfileItem label="Full Name" value={name || "N/A"} />
          <ProfileItem label="Email" value={email || "N/A"} />
          {/* Add more fields as needed */}
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
