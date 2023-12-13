import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineBook,
  AiOutlineSetting,
  AiOutlineStar,
  AiOutlineLogout,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function DashboardTutor() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 h-screen">
      <header className="bg-blue-700 py-4 h-[10vh]">
        <div className="mx-auto px-4">
          <nav className="flex text-white text-lg justify-between">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-4">
                <img src="/logo.png" alt="Logo" className="h-10" />
                <span className="text-2xl font-bold text-white">Studypal</span>
              </div>
              <Link
                to="/dashboard-tutor/"
                className="flex items-center space-x-2 hover:text-blue-300"
              >
                <AiOutlineHome className="text-xl" />
                <span>Home</span>
              </Link>
              <Link
                to="/dashboard-tutor/messages"
                className="flex items-center space-x-2 hover:text-blue-300"
              >
                <AiOutlineMessage className="text-xl" />
                <span>Messages</span>
              </Link>
              <Link
                to="/dashboard-tutor/my-lessons"
                className="flex items-center space-x-2 hover:text-blue-300"
              >
                <AiOutlineBook className="text-xl" />
                <span>My Lessons</span>
              </Link>
              <Link
                to="/dashboard-tutor/profile"
                className="flex items-center space-x-2 hover:text-blue-300"
              >
                <CgProfile className="text-xl" />
                <span> My Account</span>
              </Link>
            </div>
            <div className="flex spaxe-x-6">
              <button
                onClick={() => {
                  cookies.remove("user", { path: "/" });
                  navigate("/");
                }}
                className="flex items-center space-x-2 hover:text-blue-300"
              >
                <AiOutlineLogout className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
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
}

export default DashboardTutor;
