import { Link } from "react-router-dom";

const LoginButton: React.FC = () => {
  return (
    <div className="flex justify-center">
      <Link to="/login"
        className="
          px-6 py-2 text-white rounded-xl text-sm font-medium text-white
          bg-gradient-to-r from-slate-700 to-slate-600
          shadow-md
          transition-all duration-300
          hover:bg-gradient-to-r hover:from-slate-600
          "
      >
        Login
      </Link>
    </div>
  );
};

const RegisterButton: React.FC = () => {
  return (
    <div className="flex justify-center">
      <button
        className="
          px-6 py-2 rounded-xl text-sm font-medium text-white
          bg-gradient-to-r from-indigo-600 to-purple-600
          shadow-md
          transition-all duration-300
          hover:bg-gradient-to-r hover:from-indigo-500
          "
      >
        Register
      </button>
    </div>
  );
};

const MyAccountButton: React.FC = () => {
  return (
    <div className="flex justify-center">
      <button
        className="
          px-6 py-2 rounded-xl text-sm font-medium text-white
          bg-gradient-to-r from-slate-700 to-slate-600
          shadow-md
          transition-all duration-300
          hover:bg-gradient-to-r hover:from-slate-600
          "
        >
        My Account
      </button>
    </div>
  );
};

export {
    LoginButton,
    RegisterButton,
    MyAccountButton
}