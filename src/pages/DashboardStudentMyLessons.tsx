import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../firebase'; // Adjust this import based on your Firebase configuration file's location

const DashboardStudentMyClasses = () => {
  const navigate = useNavigate();
  const { cookies } = useOutletContext();
  const [user, setUser] = useState({});
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [classHistory, setClassHistory] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const userCookie = cookies.get("user");
      if (!userCookie) {
        navigate("/");
        return;
      }

      setUser({
        username: userCookie.username,
        fullname: userCookie.fullname,
        email: userCookie.email,
        role: userCookie.role,
        dateOfBirth: userCookie.dateOfBirth,
        phoneNumber: userCookie.phoneNumber,
      });

      const classesRef = collection(db, "class"); // Adjust "classes" to your collection name
      const q = query(classesRef, where("student", "==", userCookie.username));
      const querySnapshot = await getDocs(q);

      let allSchedules = [];
      const now = new Date();

      querySnapshot.forEach((doc) => {
        const classData = doc.data();
        classData.schedule.forEach((timestamp) => {
          const scheduleDate = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
          allSchedules.push({
            ...classData,
            schedule: scheduleDate,
          });
        });
      });

      const sortedUpcomingClasses = allSchedules.filter(
        (item) => item.schedule > now
      );
      const sortedClassHistory = allSchedules.filter(
        (item) => item.schedule <= now
      );

      setUpcomingClasses(sortedUpcomingClasses);
      setClassHistory(sortedClassHistory);
    };

    fetchClasses();
  }, [navigate, cookies]);

  const formatDate = (date) => {
    return `${date.toDateString()}, ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="container mx-auto p-4 h-4/5 flex flex-col space-y-6 h-[80vh]">
      {/* Upcoming Classes Section */}
      <div className="flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Upcoming Classes
        </h2>
        <div className="max-h-[50vh] overflow-auto flex-grow">
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((classItem) => (
              <div
                key={classItem.classID}
                className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg rounded-lg p-4 flex items-center space-x-4"
              >
                {/* Replace tutorImage with a placeholder or fetch from a URL based on tutor's username */}
                <img
                  src={`/path/to/tutor/${classItem.tutor}.jpg`}
                  alt="Tutor"
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <span className="font-semibold text-white text-lg">
                    {classItem.classID}
                  </span>
                  <span className="block text-gray-200">
                    {formatDate(classItem.schedule)}
                  </span>
                  <span className="block text-gray-200">{`Tutor: ${classItem.tutor}`}</span>
                </div>
              </div>
            ))
          ) : (
            <Paper elevation={3} className="p-4">
              <Typography variant="h6" color="textSecondary">
                No upcoming classes scheduled.
              </Typography>
            </Paper>
          )}
        </div>
      </div>

      {/* Class History Section */}
      <div className="flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Class History
        </h2>
        <div className="max-h-[50vh] overflow-auto mb-10 flex-grow">
          {classHistory.length > 0 ? (
            classHistory.map((classItem) => (
              <div
                key={classItem.classID}
                className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg rounded-lg p-4 flex items-center space-x-4"
              >
                {/* Replace tutorImage with a placeholder or fetch from a URL based on tutor's username */}
                <img
                  src={`/path/to/tutor/${classItem.tutor}.jpg`}
                  alt="Tutor"
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <span className="font-semibold text-white text-lg">
                    {classItem.classID}
                  </span>
                  <span className="block text-gray-200">
                    {formatDate(classItem.schedule)}
                  </span>
                  <span className="block text-gray-200">{`Tutor: ${classItem.tutor}`}</span>
                </div>
              </div>
            ))
          ) : (
            <Paper elevation={3} className="p-4">
              <Typography variant="h6" color="textSecondary">
                You have no class history.
              </Typography>
            </Paper>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStudentMyClasses;
