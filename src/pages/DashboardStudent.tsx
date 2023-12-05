import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineBook,
  AiOutlineSetting,
  AiOutlineStar,
  AiOutlineLogout,
} from "react-icons/ai";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DashboardStudent = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 h-screen">
      <nav className="flex justify-between items-center p-4 shadow-md bg-white h-[10vh]">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-blue-700">Studypal</span>
          <Link
            to="/find-tutor"
            className="px-3 py-2 text-blue-700 hover:text-blue-800 hover:underline"
          >
            Find Tutors
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-blue-600"
            >
              {/* SVG Path */}
            </svg>
            <span className="ml-2 text-gray-700">Balance: 0 Hours</span>
          </div>
          <div className="flex items-center">
            <AiOutlineStar className="w-6 h-6 text-yellow-500" />
            <Link
              to="/favorites"
              className="ml-2 text-gray-700 hover:text-blue-700"
            >
              Favorites
            </Link>
          </div>
        </div>
      </nav>
      <header className="bg-blue-700 py-4 h-[10vh]">
        <div className="h-full mx-auto px-4">
          <nav className="h-full flex text-white text-lg justify-between items-center">
            <div className="flex space-x-6">
              <Link
                to="/dashboard-student"
                className="flex items-center space-x-2 hover:text-blue-300"
              >
                <AiOutlineHome className="text-xl" />
                <span>Home</span>
              </Link>
              <Link
                to="/dashboard-student/messages"
                className="flex items-center space-x-2 hover:text-blue-300"
              >
                <AiOutlineMessage className="text-xl" />
                <span>Messages</span>
              </Link>
              <Link
                to="/dashboard-student/my-lessons"
                className="flex items-center space-x-2 hover:text-blue-300"
              >
                <AiOutlineBook className="text-xl" />
                <span>My Lessons</span>
              </Link>
            </div>
            <button
              onClick={() => {
                cookies.remove('user', { path: '/' });
                navigate('/');
              }}
              className="flex items-center space-x-2 hover:text-blue-300"
            >
              <AiOutlineLogout className="text-xl" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>
      <Outlet
        context={{
          cookies,
        }}
      />
    </div>
  );
};

export default DashboardStudent;
