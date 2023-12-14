import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, Paper, TextField, Typography, Rating } from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import db from "../firebase"; // Make sure this path is correct for your Firebase configuration

const DashboardStudentMyClasses = () => {
  const navigate = useNavigate();
  const { cookies } = useOutletContext();
  const [user, setUser] = useState({});
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [classHistory, setClassHistory] = useState([]);
  const [ratings, setRatings] = useState({});
  const [tutorsToRate, setTutorsToRate] = useState({});

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
        balance: userCookie.balance,
      });

      const classesRef = collection(db, "class");
      const usersRef = collection(db, "users");
      const q = query(classesRef, where("student", "==", userCookie.username));
      const querySnapshot = await getDocs(q);

      let allSchedules = [];
      const now = new Date();

      for (const doc of querySnapshot.docs) {
        const classData = doc.data();
        const classID = doc.id;

        // Fetch tutor details
        const tutorQuery = query(
          usersRef,
          where("username", "==", classData.tutor)
        );
        const tutorSnapshot = await getDocs(tutorQuery);
        const tutorData = tutorSnapshot.docs[0]?.data();

        classData.schedule.forEach((timestamp) => {
          const scheduleDate = timestamp.toDate();
          const unixTimestamp = Math.floor(scheduleDate.getTime() / 1000); // Convert to Unix timestamp
          const scheduleId = `${classID}-${unixTimestamp}`;
          allSchedules.push({
            ...classData,
            classID,
            scheduleId, // Add scheduleId to each class item
            schedule: scheduleDate,
            tutorFullName: tutorData?.fullname || "Unknown",
            tutorImageUrl: tutorData?.imageUrl || "/default-tutor-image.jpg",
          });
        });
      }

      // Sort the classes in ascending order based on their date
      allSchedules.sort((a, b) => a.schedule - b.schedule);

      const sortedUpcomingClasses = allSchedules.filter(
        (item) => item.schedule > now
      );
      const sortedClassHistory = allSchedules.filter(
        (item) => item.schedule <= now
      );

      setUpcomingClasses(sortedUpcomingClasses);
      setClassHistory(sortedClassHistory);

      // Now set tutorsToRate based on updated classHistory
      const tutorDetails = new Map();
      sortedClassHistory.forEach((classItem) => {
        // Ensure tutor details are not already added
        if (!tutorDetails.has(classItem.tutor)) {
          tutorDetails.set(classItem.tutor, {
            username: classItem.tutor,
            fullname: classItem.tutorFullName,
            imageUrl: classItem.tutorImageUrl,
          });
        }
      });
      setTutorsToRate(Array.from(tutorDetails.values()));

      let ratingsMap = {};

      for (const classItem of allSchedules) {
        const scheduleTimestamp = String(
          Math.floor(classItem.schedule.getTime() / 1000)
        );
        const ratingQuery = query(
          collection(db, "rating"),
          where("student", "==", userCookie.username),
          where("classID", "==", classItem.classID),
          where("scheduleTimestamp", "==", scheduleTimestamp)
        );

        const ratingSnapshot = await getDocs(ratingQuery);

        if (!ratingSnapshot.empty) {
          ratingSnapshot.forEach((doc) => {
            const ratingData = doc.data();
            ratingsMap[classItem.scheduleId] = ratingData.value;
          });
        } 
      }
      setRatings(ratingsMap);
    };

    fetchClasses();
  }, [navigate, cookies]);

  const formatDate = (date) => {
    return `${date.toDateString()}, ${date.toLocaleTimeString()}`;
  };

  // Submit rating to Firebase
  // Update function to handle rating change
  const handleRatingChange = async (scheduleId, newRating) => {
    if (!newRating) return;

    // Unique identifiers for Firebase query
    const [classID, scheduleTimestamp] = scheduleId.split("-");

    const ratingQuery = query(
      collection(db, "rating"),
      where("student", "==", user.username),
      where("classID", "==", classID),
      where("scheduleTimestamp", "==", scheduleTimestamp)
    );

    const querySnapshot = await getDocs(ratingQuery);

    const ratingRef = querySnapshot.empty
      ? doc(collection(db, "rating"))
      : doc(db, "rating", querySnapshot.docs[0].id);

    await setDoc(ratingRef, {
      classID,
      scheduleTimestamp,
      student: user.username,
      value: newRating,
    });

    setRatings((prevRatings) => ({ ...prevRatings, [scheduleId]: newRating }));
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
                key={classItem.scheduleId}
                className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg rounded-lg p-4 flex items-center space-x-4"
              >
                <img
                  src={classItem.tutorImageUrl}
                  alt="Tutor"
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <span className="block text-gray-200">
                    {formatDate(classItem.schedule)}
                  </span>
                  <span className="block text-gray-200">{`Tutor: ${classItem.tutorFullName}`}</span>
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
                key={classItem.scheduleId}
                className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={classItem.tutorImageUrl}
                    alt="Tutor"
                    className="h-16 w-16 rounded-full"
                  />
                  <div>
                    <span className="block text-gray-200">
                      {formatDate(classItem.schedule)}
                    </span>
                    <span className="block text-gray-200">{`Tutor: ${classItem.tutorFullName}`}</span>
                  </div>
                </div>
                <div>
                  <Rating
                    name={`rating-${classItem.scheduleId}`}
                    value={Number(ratings[classItem.scheduleId]) || 0}
                    onChange={(event, newValue) => {
                      handleRatingChange(classItem.scheduleId, newValue);
                    }}
                  />
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
