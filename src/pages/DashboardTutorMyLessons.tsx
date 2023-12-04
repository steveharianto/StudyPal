import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";
import db from "../firebase";

type MyClass = {
    class: {
        classID: string;
        tutor: string;
        student: string;
        schedule: string[];
    };
};

type MyActiveClass = {
    activeClassID: string;
    classID: string;
    schedule: string[];
    students: string[];
    chatID: string;
};

function DashboardTutorMyLessons() {
    const classCollectionRef = collection(db, "class");
    const [myClass, setMyClass] = useState<MyClass[]>([]);
    const [currentClass, setCurrentClass] = useState({});
    const fetchMyClass = async () => {
        const getMyClass = await getDocs(query(classCollectionRef, where("tutor", "==", "tutor1")));
        const myClassList = getMyClass.docs.map((cl) => cl.data() as MyClass);
        setMyClass(myClassList);
    };

    useEffect(() => {
        fetchMyClass();
    }, []);

    // Will be replaced, get data from firebase
    const [users, setUsers] = useState([
        {
            userID: "U001",
            username: "Username1",
            email: "user1@gmail.com",
            password: "pass0001",
            dob: "2023-11-21T12:30:45.678Z",
            role: "Student",
        },
        {
            userID: "U002",
            username: "Username2",
            email: "user2@gmail.com",
            password: "pass0002",
            dob: "2023-11-21T12:30:45.678Z",
            role: "Tutor",
        },
        {
            userID: "U003",
            username: "Username3",
            email: "user3@gmail.com",
            password: "pass0003",
            dob: "2023-11-21T12:30:45.678Z",
            role: "Student",
        },
        {
            userID: "U004",
            username: "Username4",
            email: "user4@gmail.com",
            password: "pass0004",
            dob: "2023-11-21T12:30:45.678Z",
            role: "Student",
        },
        {
            userID: "U005",
            username: "Username5",
            email: "user5@gmail.com",
            password: "pass0005",
            dob: "2023-11-21T12:30:45.678Z",
            role: "Student",
        },
    ]);
    const [classes, setClasses] = useState([
        {
            classID: "C001",
            image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4vlkTJCWbP2Kh2vyK9BdEw.png",
            name: "Flutter for Beginners",
            description: 'In a "Flutter for Beginners" tutor class, aspiring developers are introduced to the fundamentals of Flutter, a popular open-source framework for building natively compiled applications for mobile, web, and desktop from a single codebase.',
            tutor: "U002",
            schedule: ["Mon-11", "Mon-17", "Tue-12"],
            tag: "IT & Software",
            price: 125000,
            rating: 4.9,
        },
        {
            classID: "002",
            image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4vlkTJCWbP2Kh2vyK9BdEw.png",
            name: "Flutter for Professionals",
            description: 'In a "Flutter for Beginners" tutor class, aspiring developers are introduced to the fundamentals of Flutter, a popular open-source framework for building natively compiled applications for mobile, web, and desktop from a single codebase.',
            tutor: "U002",
            schedule: ["Mon-11", "Mon-17", "Tue-12"],
            tag: "IT & Software",
            price: 125000,
            rating: 4.9,
        },
    ]);

    const [activeClass, setActiveClass] = useState([
        {
            activeClassID: "AC001",
            classID: "C001",
            schedule: ["Mon-11", "Tue-11", "Thu-11"],
            students: ["U001", "U003", "U004", "U005", "U006"],
            chatID: "CH001",
        },
    ]);

    const [currentUser, setCurrentUser] = useState({
        userID: "U002",
        username: "Username2",
        email: "user2@gmail.com",
        password: "pass0002",
        dob: "2023-11-21T12:30:45.678Z",
        role: "Tutor",
    });

    // Main Functions
    const [isModal, setIsModal] = useState(false);

    const [timeIntervals, setTimeIntervals] = useState(["00:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00", "05:00 - 06:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"]);

    const toggleSchedule = (day, time) => {
        const scheduleItem = `${day}-${time}`;
        if (currentClass.schedule.includes(scheduleItem)) {
            // If it's already in the schedule, remove it
            setCurrentClass((prevClass) => ({
                ...prevClass,
                schedule: prevClass.schedule.filter((item) => item !== scheduleItem),
            }));
        } else {
            // If it's not in the schedule, add it
            setCurrentClass((prevClass) => ({
                ...prevClass,
                schedule: [...prevClass.schedule, scheduleItem],
            }));
        }
    };

    // Utility
    const convertToReadableFormat = (session) => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const daysActual = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = daysOfWeek.indexOf(session.split("-")[0]);
        const time = session.split("-")[1];

        if (dayIndex !== -1) {
            const day = daysActual[dayIndex];
            const formattedTime = `${time.slice(0, 2).padStart(2, "0")}:00 - ${String(parseInt(time) + 1).padStart(2, "0")}:00`;
            return `${day}, ${formattedTime}`;
        }

        return session; // Return original input if the day is not found
    };

    // Generate Time Table
    const generateTableRows = () => {
        return timeIntervals.map((interval, index) => (
            <tr key={index}>
                <td className={currentClass.schedule.includes(`Mon-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer"} onClick={() => toggleSchedule("Mon", interval.split(" - ")[0].split(":")[0])}>
                    {interval}
                </td>
                <td className={currentClass.schedule.includes(`Tue-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer" : "rounded hover:bg-blue-300 hover:cursor-pointer"} onClick={() => toggleSchedule("Tue", interval.split(" - ")[0].split(":")[0])}>
                    {interval}
                </td>
                <td className={currentClass.schedule.includes(`Wed-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer" : "rounded hover:bg-blue-300 hover:cursor-pointer"} onClick={() => toggleSchedule("Wed", interval.split(" - ")[0].split(":")[0])}>
                    {interval}
                </td>
                <td className={currentClass.schedule.includes(`Thu-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer" : "rounded hover:bg-blue-300 hover:cursor-pointer"} onClick={() => toggleSchedule("Thu", interval.split(" - ")[0].split(":")[0])}>
                    {interval}
                </td>
                <td className={currentClass.schedule.includes(`Fri-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer" : "rounded hover:bg-blue-300 hover:cursor-pointer"} onClick={() => toggleSchedule("Fri", interval.split(" - ")[0].split(":")[0])}>
                    {interval}
                </td>
                <td className={currentClass.schedule.includes(`Sat-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer" : "rounded hover:bg-blue-300 hover:cursor-pointer"} onClick={() => toggleSchedule("Sat", interval.split(" - ")[0].split(":")[0])}>
                    {interval}
                </td>
                <td className={currentClass.schedule.includes(`Sun-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer" : "rounded hover:bg-blue-300 hover:cursor-pointer"} onClick={() => toggleSchedule("Sun", interval.split(" - ")[0].split(":")[0])}>
                    {interval}
                </td>
            </tr>
        ));
    };
    return (
        <>
            <div className="h-[60vh] mx-16 mt-4">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">My Lessons</h2>
                <div className="max-h-[50vh] overflow-auto">
                    {myClass.map((lesson) => {
                        const today = new Date().toLocaleString("en-US", { weekday: "short" });
                        const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                        const currentDayIndex = lesson.schedule.findIndex((session) => session.startsWith(today));
                        let nextSession = " - ";
                        if (currentDayIndex !== -1) {
                            const currentSessionTime = lesson?.schedule[currentDayIndex].split("-")[1];

                            if (currentTime < currentSessionTime) {
                                nextSession = lesson.schedule[currentDayIndex];
                            } else {
                                const nextDayIndex = (currentDayIndex + 1) % lesson.schedule.length;
                                nextSession = lesson.schedule[nextDayIndex];
                            }
                        } else {
                            nextSession = lesson.schedule[0];
                        }
                        return (
                            <div
                                key={lesson.classID}
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
                                        <span className="block text-gray-200">Next Session : {convertToReadableFormat(nextSession)} </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {isModal && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white w-[70em] h-[40em] p-4 rounded-lg shadow-lg flex justify-between overflow-y-auto">
                        <div className="flex flex-col w-[30%] h-full justify-between">
                            <div>
                                <div className="rounded-lg h-[55%]">
                                    <img src={currentClass.image} alt="" className="object-cover h-full w-full rounded-t-lg" />
                                </div>
                                <h2 className="text-xl font-semibold mb-1">{currentClass.name} </h2>
                                <div className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[0.75em] rounded-md h-fit w-fit my-auto">{currentClass.tag}</div>
                                <p className="text-gray-700 text-sm mt-4">{currentClass.description}</p>
                            </div>
                            <div>
                                <button
                                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    onClick={() => {
                                        setIsModal(false);
                                    }}
                                >
                                    Close
                                </button>
                                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ms-4">Edit Lesson</button>
                            </div>
                        </div>
                        <div className="flex flex-col w-[70%] justify-between">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="w-[6em]">Monday</th>
                                        <th className="w-[6em]">Tuesday</th>
                                        <th className="w-[6em]">Wednesday</th>
                                        <th className="w-[6em]">Thursday</th>
                                        <th className="w-[6em]">Friday</th>
                                        <th className="w-[6em]">Saturday</th>
                                        <th className="w-[6em]">Sunday</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs text-center text-gray-500 select-none">{generateTableRows()}</tbody>
                            </table>
                            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-[50%]">Save Schedule</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DashboardTutorMyLessons;
