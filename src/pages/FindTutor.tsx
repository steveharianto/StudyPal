import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import db from "../firebase";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const FindTutor = () => {
    const navigate = useNavigate();
    // Main Variables
    const [tutors, setTutors] = useState([]);
    const [classes, setClasses] = useState([]);
    const [rating, setRating] = useState([]);

    const [isModal, setIsModal] = useState(false);
    const [timeIntervals, setTimeIntervals] = useState(["00:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00", "05:00 - 06:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"]);

    const [currentCategory, setCurrentCategory] = useState("ui/ux design");
    const [currentTutor, setCurrentTutor] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");

    // Fetches
    const fetchTutors = async () => {
        const getTutorsQuery = query(collection(db, "users"), where("role", "==", "tutor"));
        const tutorSnapshot = await getDocs(getTutorsQuery);
        let temptutors = [];
        tutorSnapshot.forEach((doc) => {
            temptutors.push(doc.data());
        });
        setTutors(temptutors);
    };
    const fetchClasses = async () => {
        const getClassesQuery = query(collection(db, "class"));
        const classesSnapshot = await getDocs(getClassesQuery);
        let tempclass = [];
        classesSnapshot.forEach((doc) => {
            tempclass.push(doc.data());
        });
        setClasses(tempclass);
    };
    const fetchrating = async () => {
        const getRatingQuery = query(collection(db, "rating"));
        const ratingSnapshot = await getDocs(getRatingQuery);
        let temprating = [];
        ratingSnapshot.forEach((doc) => {
            temprating.push(doc.data());
        });
        setRating(temprating);
    };
    const fetchCurrentUser = () => {
        const cookies = new Cookies();
        const userCookie = cookies.get("user");

        console.log(userCookie);
        if (userCookie) {
            setCurrentUser(userCookie);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchTutors();
        fetchClasses();
        fetchrating();
    }, []);

    // Functions
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleCheckoutButton = () => {
        if (Object.keys(currentUser).length == 0) {
            navigate("/login");
        }
    };

    const toggleSchedule = (day, time) => {
        const scheduleItem = `${day}-${time}`;
        if (selectedSchedule.includes(scheduleItem)) {
            // If it's already in the schedule, remove it
            setSelectedSchedule(selectedSchedule.filter((item) => item !== scheduleItem));
        } else {
            // If it's not in the schedule, add it
            setSelectedSchedule([...selectedSchedule, scheduleItem]);
        }
    };

    const generateTableRows = () => {
        return timeIntervals.map((interval, index) => (
            <tr key={index} className="text-white">
                <td
                    className={currentTutor.schedule.includes(`Mon-${interval.split(" - ")[0].split(":")[0]}`) && (selectedSchedule.includes(`Mon-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500")}
                    onClick={() => {
                        currentTutor.schedule.includes(`Mon-${interval.split(" - ")[0].split(":")[0]}`) && toggleSchedule("Mon", interval.split(" - ")[0].split(":")[0]);
                    }}
                >
                    {interval}
                </td>
                <td
                    className={currentTutor.schedule.includes(`Tue-${interval.split(" - ")[0].split(":")[0]}`) && (selectedSchedule.includes(`Tue-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500")}
                    onClick={() => {
                        currentTutor.schedule.includes(`Tue-${interval.split(" - ")[0].split(":")[0]}`) && toggleSchedule("Tue", interval.split(" - ")[0].split(":")[0]);
                    }}
                >
                    {interval}
                </td>
                <td
                    className={currentTutor.schedule.includes(`Wed-${interval.split(" - ")[0].split(":")[0]}`) && (selectedSchedule.includes(`Wed-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500")}
                    onClick={() => currentTutor.schedule.includes(`Wed-${interval.split(" - ")[0].split(":")[0]}`) && toggleSchedule("Wed", interval.split(" - ")[0].split(":")[0])}
                >
                    {interval}
                </td>
                <td
                    className={currentTutor.schedule.includes(`Thu-${interval.split(" - ")[0].split(":")[0]}`) && (selectedSchedule.includes(`Thu-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500")}
                    onClick={() => currentTutor.schedule.includes(`Thu-${interval.split(" - ")[0].split(":")[0]}`) && toggleSchedule("Thu", interval.split(" - ")[0].split(":")[0])}
                >
                    {interval}
                </td>
                <td
                    className={currentTutor.schedule.includes(`Fri-${interval.split(" - ")[0].split(":")[0]}`) && (selectedSchedule.includes(`Fri-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500")}
                    onClick={() => currentTutor.schedule.includes(`Fri-${interval.split(" - ")[0].split(":")[0]}`) && toggleSchedule("Fri", interval.split(" - ")[0].split(":")[0])}
                >
                    {interval}
                </td>
                <td
                    className={currentTutor.schedule.includes(`Sat-${interval.split(" - ")[0].split(":")[0]}`) && (selectedSchedule.includes(`Sat-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500")}
                    onClick={() => currentTutor.schedule.includes(`Sat-${interval.split(" - ")[0].split(":")[0]}`) && toggleSchedule("Sat", interval.split(" - ")[0].split(":")[0])}
                >
                    {interval}
                </td>
                <td
                    className={currentTutor.schedule.includes(`Sun-${interval.split(" - ")[0].split(":")[0]}`) && (selectedSchedule.includes(`Sun-${interval.split(" - ")[0].split(":")[0]}`) ? "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500  hover:cursor-pointer transition" : "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500")}
                    onClick={() => currentTutor.schedule.includes(`Sun-${interval.split(" - ")[0].split(":")[0]}`) && toggleSchedule("Sun", interval.split(" - ")[0].split(":")[0])}
                >
                    {interval}
                </td>
            </tr>
        ));
    };
    return (
        <>
            <div className={`w-[80%] min-h-full mx-auto mt-8 flex flex-col ${isModal && "blur-lg"}`}>
                <div className="flex justify-between">
                    <div className="flex">
                        <div>
                            <select id="dropdown" name="dropdown" value={selectedOption} onChange={handleSelectChange} className="block p-2 border rounded-md">
                                <option value="">Category</option>
                                <option value="IT & Software">IT & Software</option>
                                <option value="IT & Software">IT & Software</option>
                                <option value="IT & Software">IT & Software</option>
                                <option value="IT & Software">IT & Software</option>
                            </select>
                        </div>
                        <div className="relative ms-4 w-96">
                            <input type="text" name="" id="" className="pl-8 pr-2 py-2 border rounded-md w-full" placeholder="Search..." />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 absolute left-2 top-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <p className="text-gray-500 me-4">Sort by: </p>
                        <div>
                            <select id="dropdown" name="dropdown" value={selectedOption} onChange={handleSelectChange} className="block p-2 border rounded-md">
                                <option value="Trending">Trending</option>
                                <option value="Trending">Trending</option>
                                <option value="Trending">Trending</option>
                                <option value="Trending">Trending</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between py-2 border-b-2">
                    <div className="flex">
                        <p>Suggestion: </p>
                        {/* Suggestions Map TBD */}
                        <p className="text-blue-600 mx-2">user interface</p>
                        <p className="text-blue-600 mx-2">user experience</p>
                        <p className="text-blue-600 mx-2">web design</p>
                    </div>

                    <div className="flex">
                        <p className="font-medium">{tutors.length.toLocaleString()}</p> <p className="mx-1">results find for </p>
                        <p>"{currentCategory}"</p>
                    </div>
                </div>
                <div className="flex flex-wrap mt-4">
                    {tutors.map((item, index) => {
                        const myClasses = classes.filter((cls) => cls.tutor === item.username);
                        const myRatings = rating.filter((rate) => rate.tutor === item.username);
                        const avgRating = myRatings.length > 0 ? myRatings.reduce((sum, rate) => sum + rate.value, 0) / myRatings.length : 0;

                        return (
                            <div
                                className="flex flex-col h-72 md:w-[20%] my-4 md:mx-[2.5%] border-2 rounded-lg w-[40%] mx-[5%] shadow-lg hover:cursor-pointer hover:scale-105 transition-all"
                                key={index}
                                onClick={() => {
                                    setIsModal(true);
                                    setCurrentTutor(item);
                                }}
                            >
                                <div className="rounded-t-lg h-[55%]">
                                    <img src={item.imageUrl} alt="" className="object-cover h-full w-full rounded-t-lg" />
                                </div>
                                <div className="flex justify-between px-2 py-2">
                                    <div className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[0.6em] rounded-sm h-fit my-auto">{item.subject}</div>
                                    <div className="text-blue-600 h-fit">Rp. {item.price.toLocaleString()}</div>
                                </div>
                                <div className="px-2 font-medium text-sm tracking-wide h-12">{item.fullname}</div>
                                <hr />
                                <div className="flex justify-between my-auto px-2">
                                    <div className="flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" strokeWidth={1.5} stroke="yellow" className="w-5 h-5 my-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                        <div className="ms-1 text-sm">{avgRating}</div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 my-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        <p className="text-sm my-auto"> {myClasses.length}</p>
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
                            <div className="overflow-y-auto">
                                <div className="rounded-lg h-[45%]">
                                    <img src={currentTutor.imageUrl} alt="" className="object-cover h-full w-full rounded-lg" />
                                </div>
                                <h2 className="text-xl font-semibold mb-1">{currentTutor.fullname} </h2>
                                <div className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[0.75em] rounded-md h-fit w-fit my-auto">{currentTutor.subject}</div>
                                <p className="text-gray-700 text-sm mt-4">{currentTutor.description}</p>
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
                            <div className={`${selectedSchedule.length * currentTutor.price != 0 && currentUser && (currentUser?.balance >= selectedSchedule.length * currentTutor.price ? "text-green-400" : "text-red-400")}`}> Total Price : Rp. {(selectedSchedule.length * currentTutor.price).toLocaleString()}</div>
                            <button
                                className={`transition mt-4  py-2 px-4 rounded  w-[50%] ${selectedSchedule.length * currentTutor.price != 0 && currentUser?.balance >= selectedSchedule.length * currentTutor.price ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-500"}`}
                                onClick={() => {
                                    if (selectedSchedule.length * currentTutor.price != 0) {
                                        handleCheckoutButton();
                                    }
                                }}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FindTutor;
