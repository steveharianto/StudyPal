import React from "react";
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineBook,
  AiOutlineSetting,
  AiOutlineStar,
} from "react-icons/ai";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

const DashboardStudent = () => {
  return (
    <div className="bg-gray-50 h-screen">
      <nav className="flex justify-between items-center p-4 shadow bg-white h-[5rem]">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 mr-3" />
          <span className="text-xl font-bold text-blue-600">Studypal</span>
          <a
            href="#"
            className="ml-4 px-3 py-2 text-blue-600 hover:text-blue-700"
          >
            Find Tutors
          </a>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {/* SVG Path */}
            </svg>
            <span className="ml-2 text-gray-600">Balance: 0 Hours</span>
          </div>
          <div className="flex items-center">
            <AiOutlineStar className="w-6 h-6 text-gray-600" />
            <a href="#" className="ml-2 text-gray-600 hover:text-blue-600">
              Favorites
            </a>
          </div>
        </div>
      </nav>
      <header className="bg-blue-600 py-4 h-[3.8rem]">
        <div className="mx-auto px-4">
          <nav className="flex space-x-8 text-white">
            <Link
              to={"/dashboard-student/home"}
              className="flex items-center space-x-1 hover:text-blue-300"
            >
              <AiOutlineHome className="text-lg" />
              <span>Home</span>
            </Link>
            <Link
              to={"/dashboard-student/messages"}
              className="flex items-center space-x-1 hover:text-blue-300"
            >
              <AiOutlineMessage className="text-lg" />
              <span>Messages</span>
            </Link>
            <a
              href="#"
              className="flex items-center space-x-1 hover:text-blue-300"
            >
              <AiOutlineBook className="text-lg" />
              <span>My lessons</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 hover:text-blue-300"
            >
              <AiOutlineSetting className="text-lg" />
              <span>Settings</span>
            </a>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default DashboardStudent;
