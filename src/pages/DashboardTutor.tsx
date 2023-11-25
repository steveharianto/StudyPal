import { AiOutlineHome, AiOutlineMessage, AiOutlineBook, AiOutlineSetting, AiOutlineStar, AiOutlineLogout } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Outlet, Link } from "react-router-dom";

function DashboardTutor() {
    return (
        <div className="bg-gray-50 h-screen">
            <nav className="flex justify-between items-center p-4 shadow-md bg-white h-[10vh]">
                <div className="flex items-center space-x-4">
                    <img src="/logo.png" alt="Logo" className="h-10" />
                    <span className="text-2xl font-bold text-blue-700">Studypal</span>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <AiOutlineStar className="w-6 h-6 text-yellow-500" />
                        <Link to="/favorites" className="ml-2 text-gray-700 hover:text-blue-700">
                            3.3
                        </Link>
                    </div>
                </div>
            </nav>
            <header className="bg-blue-700 py-4 h-[10vh]">
                <div className="mx-auto px-4">
                    <nav className="flex text-white text-lg justify-between">
                        <div className="flex space-x-6">
                            <Link to="/dashboard-tutor/home" className="flex items-center space-x-2 hover:text-blue-300">
                                <AiOutlineHome className="text-xl" />
                                <span>Home</span>
                            </Link>
                            <Link to="/dashboard-tutor/messages" className="flex items-center space-x-2 hover:text-blue-300">
                                <AiOutlineMessage className="text-xl" />
                                <span>Messages</span>
                            </Link>
                            <Link to="/dashboard-tutor/my-lessons" className="flex items-center space-x-2 hover:text-blue-300">
                                <AiOutlineBook className="text-xl" />
                                <span>My Lessons</span>
                            </Link>
                            <Link to="/settings" className="flex items-center space-x-2 hover:text-blue-300">
                                <AiOutlineSetting className="text-xl" />
                                <span>Settings</span>
                            </Link>
                            <Link to="/dashboard-tutor/profile" className="flex items-center space-x-2 hover:text-blue-300">
                                <CgProfile className="text-xl" />
                                <span>Profile</span>
                            </Link>
                        </div>
                        <Link to="/" className="flex items-center space-x-2 hover:text-blue-300">
                            <AiOutlineLogout className="text-xl" />
                            <span>Logout</span>
                        </Link>
                    </nav>
                </div>
            </header>
            <Outlet />
        </div>
    );
}

export default DashboardTutor;
