import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";
import db from "../firebase";
import Cookies from "universal-cookie";
import { MyClass, User, Classes } from "../Types";
import { parseDate } from "../utils";

function DashboardTutorMyLessons() {
    const cookies = new Cookies();
    const userCookie = cookies.get("user");
    const now = new Date();
    const classCollectionRef = collection(db, "class");
    const timeIntervals = ["00:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00", "05:00 - 06:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"];

    const [myClass, setMyClass] = useState<MyClass[]>([]);
    const [currentClass, setCurrentClass] = useState<MyClass>(null);
    const [currentUser, setCurrentUser] = useState<User>();

    const [isModal, setIsModal] = useState(false);

    const fetchMyClass = async () => {
        const getMyClass = await getDocs(query(classCollectionRef, where("tutor", "==", userCookie.username)));
        let myClassList: MyClass[] = getMyClass.docs.map((cl) => cl.data() as MyClass);

        // Loop to add nextSession Variable
        myClassList = myClassList.map((lesson) => {
            const now = new Date();
            const sortedTimestamps = lesson.schedule
                .map((timestamp) => timestamp.toDate()) // Convert Firestore Timestamp to JavaScript Date
                .sort((a, b) => a - b); // Sort in ascending order

            // Find Next Timestamp from now
            let nextSession: string | Date = "No upcoming timestamp found";
            for (const t of sortedTimestamps) {
                if (t > now) {
                    nextSession = new Date(t);
                    break;
                }
            }

            // Convert to appropriate String Format -> December 12, 2023 at 07:00 PM
            if (typeof nextSession !== "string") {
                nextSession = nextSession.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
            }

            return { ...lesson, nextSession };
        });

        // Sort According to Next Session
        myClassList.sort((a, b) => {
            const dateA = a.nextSession === "No upcoming timestamp found" ? new Date() : new Date(parseDate(a.nextSession) || ""); // Convert nextSession to a Date object
            const dateB = b.nextSession === "No upcoming timestamp found" ? new Date() : new Date(parseDate(b.nextSession) || ""); // Convert nextSession to a Date object
            return dateA - dateB;
        });

        setMyClass(myClassList);
    };
    const fetchCurrentUser = () => {
        if (userCookie) {
            setCurrentUser(userCookie);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchMyClass();
    }, []);

    // const toggleSchedule = (day: string, time: string) => {
    //     const scheduleItem = `${day}-${time}`;
    //     if (currentClass.schedule.includes(scheduleItem)) {
    //         // If it's already in the schedule, remove it
    //         setCurrentClass((prevClass) => ({
    //             ...prevClass,
    //             schedule: prevClass.schedule.filter((item) => item !== scheduleItem),
    //         }));
    //     } else {
    //         // If it's not in the schedule, add it
    //         setCurrentClass((prevClass) => ({
    //             ...prevClass,
    //             schedule: [...prevClass.schedule, scheduleItem],
    //         }));
    //     }
    // };

    // Utility

    // Generate Time Table
    // const generateTableRows = () => {
    //     const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    //     const generateTd = (day: string, interval: string) => {
    //         const time = interval.split(" - ")[0].split(":")[0];
    //         const isSelected = currentClass.schedule.includes(`${day}-${time}`);
    //         const className = isSelected ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer";

    //         return (
    //             <td className={className} onClick={() => toggleSchedule(day, time)}>
    //                 {interval}
    //             </td>
    //         );
    //     };

    //     return timeIntervals.map((interval, index) => <tr key={index}>{days.map((day) => generateTd(day, interval))}</tr>);
    // };

    return (
        <>
            <div className="h-[60vh] mx-16 mt-4">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Upcomming Classes</h2>
                <div className="max-h-[50vh] overflow-auto">
                    {myClass.map((lesson) => {
                        if (lesson.nextSession !== "No upcoming timestamp found") {
                            return (
                                <div
                                    key={lesson.id}
                                    className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg rounded-lg p-4 flex items-center space-x-4 hover:cursor-pointer"
                                    onClick={() => {
                                        setCurrentClass(lesson);
                                        setIsModal(true);
                                    }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <img src="/logo.png" alt="Tutor" className="h-16 w-16 rounded-full" />
                                        <div>
                                            <span className="font-semibold text-white text-lg">Class with {lesson.student}</span>
                                            <span className="block text-gray-200">Next Session : {lesson.nextSession}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-6">Class History</h2>
                <div className="max-h-[50vh] overflow-auto">
                    {myClass.map((lesson) => {
                        if (lesson.nextSession === "No upcoming timestamp found") {
                            return (
                                <div
                                    key={lesson.id}
                                    className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg rounded-lg p-4 flex items-center space-x-4 hover:cursor-pointer"
                                    onClick={() => {
                                        setCurrentClass(lesson);
                                        setIsModal(true);
                                    }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <img src="/logo.png" alt="Tutor" className="h-16 w-16 rounded-full" />
                                        <div>
                                            <span className="font-semibold text-white text-lg">Class with {lesson.student}</span>
                                            <span className="block text-gray-200"></span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
            {isModal && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white w-[70em] h-[35em] p-4 rounded-lg shadow-lg flex justify-between overflow-y-auto">
                        <div className="flex flex-col w-[30%] h-full justify-between">
                            <div>
                                <img src="/tutor_placeholder_image.jpeg" alt="Tutor" className="w-full object-cover rounded-xl shadow-md aspect-[1/1]" />
                                <p className="font-bold text-xl text-center mt-2">{currentClass.student}</p>
                                <p>
                                    Finished Class : {currentClass.schedule.filter((timestamp) => timestamp.toDate() < now).length} / {currentClass.schedule.length}
                                </p>
                            </div>
                            <div>
                                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600  w-full ">Chat with Student</button>
                            </div>
                            <div>
                                <button
                                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                    onClick={() => {
                                        setIsModal(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <div className=" px-4 flex flex-col w-[70%] justify-between">
                            <p className="font-bold text-xl text-blue-500">All Upcoming Sessions</p>
                            {currentClass.schedule.filter((timestamp) => timestamp.toDate() > now).length == 0 ? (
                                <div className=" w-full h-full flex items-center justify-center">
                                    <p className="text-xl">All Sessions Completed!</p>
                                </div>
                            ) : (
                                <div className=" w-full h-full flex flex-col">
                                    {currentClass.schedule.map((c, index) => {
                                        const now = new Date();
                                        if (c.toDate() > now) {
                                            return (
                                                <div key={index} className="w-full h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg my-2 flex items-center px-4">
                                                    <p className="block text-gray-200">{c.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DashboardTutorMyLessons;
