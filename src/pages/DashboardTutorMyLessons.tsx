import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "@firebase/firestore";
import db from "../firebase";
import Cookies from "universal-cookie";
import { MyClass, User, Classes, Chats } from "../Types";
import { parseDate } from "../utils";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function DashboardTutorMyLessons() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userCookie = cookies.get("user");
    const now = new Date();
    const classCollectionRef = collection(db, "class");
    const chatsCollectionRef = collection(db, "chats");

    const [myClass, setMyClass] = useState<MyClass[]>([]);
    const [historyUsername, setHistoryUsername] = useState({});
    const [currentHistory, setCurrentHistory] = useState();
    const [currentName, setCurrentName] = useState<string>();
    const [currentClass, setCurrentClass] = useState<MyClass | null>(null);
    const [currentUser, setCurrentUser] = useState<User>();
    const [chats, setChats] = useState<Chats[]>();

    const [isModal, setIsModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);

    const fetchChats = async () => {
        const getChats = await getDocs(query(chatsCollectionRef));
        const chatsList: Chats[] = getChats.docs.map((c) => c.data() as Chats);

        setChats(chatsList);
    };

    // Object.keys(myDictionary).forEach((key) => {
    //     doubledDictionary[key] = myDictionary[key] * 2;
    //   });
    const fetchMyClass = async () => {
        const getMyClass = await getDocs(query(classCollectionRef, where("tutor", "==", userCookie.username)));
        let myClassList: MyClass[] = getMyClass.docs.map((cl) => cl.data() as MyClass);
        let studentList: { [student: string]: Timestamp[] } = {};

        for (const myClassItem of myClassList) {
            const student = myClassItem.student;
            const timestamps = myClassItem.schedule;

            // Check if the student already exists in studentList
            if (studentList[student]) {
                // If the student exists, append the timestamps to their existing list
                studentList[student].push(...timestamps);
            } else {
                // If the student doesn't exist, create a new entry with the timestamps
                studentList[student] = timestamps;
            }
        }
        setHistoryUsername(studentList);
        

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
        fetchChats();
    }, []);

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
                    {Object.keys(historyUsername).map((student, index) => {
                            return (
                                <div
                                    key={index}
                                    className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg rounded-lg p-4 flex items-center space-x-4 hover:cursor-pointer"
                                    onClick={() => {
                                        setCurrentHistory(historyUsername[student]);
                                        setCurrentName(student);
                                        setHistoryModal(true);
                                    }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <img src="/logo.png" alt="Tutor" className="h-16 w-16 rounded-full" />
                                        <div>
                                            <span className="font-semibold text-white text-lg">Class with {student}</span>
                                            <span className="block text-gray-200"></span>
                                        </div>
                                    </div>
                                </div>
                            );
                    })}
                </div>
            </div>
            {isModal && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white w-[70em] h-[35em] p-4 rounded-lg shadow-lg flex justify-between overflow-y-auto">
                        <div className="flex flex-col w-[30%] h-full justify-between">
                            <div>
                                <img src="/tutor_placeholder_image.jpeg" alt="Tutor" className="w-full object-cover rounded-xl shadow-md aspect-[1/1]" />
                                <p className="font-bold text-xl text-center mt-2">{currentClass?.student}</p>
                                <p>
                                    Finished Class : {currentClass.schedule.filter((timestamp) => timestamp.toDate() < now).length} / {currentClass.schedule.length}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600  w-full "
                                    onClick={async () => {
                                        const filteredChats = chats?.filter((chat) => {
                                            return (chat.firstPerson === currentUser?.username && chat.secondPerson === currentClass?.student) || (chat.firstPerson === currentClass?.student && chat.secondPerson === currentUser?.username);
                                        });
                                        console.log(filteredChats);
                                        if (filteredChats?.length == 0) {
                                            // Generate ID
                                            const querySnapshot = await getDocs(query(chatsCollectionRef, orderBy("chatId", "desc"), limit(1)));
                                            let maxId = 0;

                                            if (!querySnapshot.empty) {
                                                const maxDoc = querySnapshot.docs[0];
                                                maxId = (maxDoc.data() as Chats).chatId;
                                            }
                                            maxId++;

                                            await addDoc(chatsCollectionRef, {
                                                chatId: maxId,
                                                firstPerson: currentUser?.username,
                                                secondPerson: currentClass?.student,
                                            });

                                            cookies.set("redirectChat", maxId);
                                            navigate("../messages");
                                        } else {
                                            cookies.set("redirectChat", filteredChats[0]?.chatId);
                                            navigate("../messages");
                                        }
                                    }}
                                >
                                    Chat with Student
                                </button>
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
            )}{historyModal && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white w-[70em] h-[35em] p-4 rounded-lg shadow-lg flex justify-between overflow-y-auto">
                        <div className="flex flex-col w-[30%] h-full justify-between">
                            <div>
                                <img src="/tutor_placeholder_image.jpeg" alt="Tutor" className="w-full object-cover rounded-xl shadow-md aspect-[1/1]" />
                                <p className="font-bold text-xl text-center mt-2">{currentName}</p>
                            </div>
                            <div>
                                <button
                                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                    onClick={() => {
                                        setHistoryModal(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <div className=" px-4 flex flex-col w-[70%] justify-between">
                            <p className="font-bold text-xl text-blue-500">Completed Sessions</p>
                            
                            <div className=" w-full h-full flex flex-col">
                            {currentHistory?.map((c,index) => {
                                
                                const now = new Date();
                                if (c.toDate() < now) {
                                return (<div key={index} className="w-full h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg my-2 flex items-center px-4">
                                <p className="block text-gray-200">{c.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                            </div>)}
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DashboardTutorMyLessons;
