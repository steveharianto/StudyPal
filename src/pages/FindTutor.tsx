import { SetStateAction, useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, where, addDoc, updateDoc, doc } from "firebase/firestore";
import db from "../firebase";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { User, Classes, Rating, Tutor } from "../Types";
import { getCurrentWeekSchedule, convertTimeStringToTimestamp } from "../utils";

const FindTutor = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const cookies = new Cookies();
    const userCookie = cookies.get("user");

    const ClassCollectionRef = collection(db, "class");
    const UsersCollectionRef = collection(db, "users");

    // Main Variables
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [classes, setClasses] = useState<Classes[]>([]);
    const [rating, setRating] = useState<Rating[]>([]);

    const [isModal, setIsModal] = useState(false);
    const timeIntervals = ["00:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00", "05:00 - 06:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"];

    const [currentCategory, setCurrentCategory] = useState("");
    const [currentTutor, setCurrentTutor] = useState<Tutor | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>();
    const [selectedSchedule, setSelectedSchedule] = useState<string[]>([]);
    const [selectedSort, setSelectedSort] = useState("Trending");
    const [selectedSortDirection, setSelectedSortDirection] = useState("Descending");

    const [inputSearch, setInputSearch] = useState("");

    // Filters
    let filteredTutors = tutors.filter((tutor) => {
        const fullNameIncludesSearch = tutor.fullname.toLowerCase().includes(inputSearch.toLowerCase());
        const subjectIncludesSearch = tutor.subject.toLowerCase().includes(inputSearch.toLowerCase());
        const subjectIncludesCurrentCategory = tutor.subject.toLowerCase().includes(currentCategory.toLowerCase());

        return (fullNameIncludesSearch || subjectIncludesSearch) && subjectIncludesCurrentCategory;
    });

    // Sorts
    if (selectedSort === "Trending") {
        filteredTutors = filteredTutors.sort((a, b) => {
            const classesA = classes.filter((cls) => cls.tutor === a.username);
            const classesB = classes.filter((cls) => cls.tutor === b.username);

            return selectedSortDirection === "Descending" ? classesB.length - classesA.length : classesA.length - classesB.length;
        });
    }
    if (selectedSort === "Rating") {
        filteredTutors = filteredTutors.sort((a, b) => {
            const myRatingsA = rating.filter((rate) => rate.tutor === a.username);
            const myRatingsB = rating.filter((rate) => rate.tutor === b.username);

            const avgRatingA = myRatingsA.length > 0 ? myRatingsA.reduce((sum, rate) => sum + rate.value, 0) / myRatingsA.length : 0;
            const avgRatingB = myRatingsB.length > 0 ? myRatingsB.reduce((sum, rate) => sum + rate.value, 0) / myRatingsB.length : 0;

            return selectedSortDirection === "Descending" ? avgRatingB - avgRatingA : avgRatingA - avgRatingB;
        });
    }
    if (selectedSort === "Price") {
        filteredTutors = filteredTutors.sort((a, b) => {
            return selectedSortDirection === "Descending" ? b.price - a.price : a.price - b.price;
        });
    }

    // Fetches
    const fetchTutors = async () => {
        const tutorSnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "tutor")));
        const tempTutors: Tutor[] = [];
        tutorSnapshot.forEach((doc) => {
            tempTutors.push(doc.data() as Tutor);
        });
        setTutors(tempTutors);
    };
    const fetchClasses = async () => {
        const classesSnapshot = await getDocs(query(collection(db, "class")));
        const tempClass: Classes[] = [];
        classesSnapshot.forEach((doc) => {
            tempClass.push(doc.data() as Classes);
        });
        setClasses(tempClass);
    };
    const fetchrating = async () => {
        const ratingSnapshot = await getDocs(query(collection(db, "rating")));
        const tempRating: Rating[] = [];
        ratingSnapshot.forEach((doc) => {
            tempRating.push(doc.data() as Rating);
        });
        setRating(tempRating);
    };
    const fetchCurrentUser = () => {
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

    const handleCheckoutButton = async (price: number) => {
        // is Logged in?
        if (currentUser == null) {
            navigate("/login");
            return;
        }
        // Enough Balance?
        if (currentUser.balance < price) {
            alert("insufficient balance");
            return;
        }
        // Add Class
        await addDoc(ClassCollectionRef, {
            schedule: getCurrentWeekSchedule(selectedSchedule),
            student: currentUser.username,
            tutor: currentTutor?.username,
        });

        // Take Balance
        getDocs(query(UsersCollectionRef, where("username", "==", currentUser.username)))
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    const currentBalance = userData.balance;

                    const newBalance = currentBalance - price;

                    updateDoc(doc(UsersCollectionRef, userDoc.id), { balance: newBalance })
                        .then(() => {
                            console.log("Balance updated successfully.");
                        })
                        .catch((error) => {
                            console.error("Error updating balance: ", error);
                        });
                    // Update Cookie
                    const updatedUser = {
                        ...currentUser, // Assuming you have a function to get the user object from the cookie
                        balance: newBalance,
                    };

                    cookies.set("user", updatedUser, { path: "/" });
                    setCurrentUser(updatedUser);
                } else {
                    console.log("User not found.");
                }
            })
            .catch((error) => {
                console.error("Error querying user: ", error);
            });
    };

    const toggleSchedule = (day: string, time: string) => {
        const scheduleItem = `${day}-${time}`;
        if (selectedSchedule.includes(scheduleItem)) {
            // If it's already in the schedule, remove it
            setSelectedSchedule(selectedSchedule.filter((item) => item !== scheduleItem));
        } else {
            // If it's not in the schedule, add it
            setSelectedSchedule([...selectedSchedule, scheduleItem]);
        }
    };

    const generateHeader = (currentDate: Date) => {
        // Calculate the start of the current week (Sunday as the first day)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 7);

        // Create an array to store the days of the week
        const daysOfWeek = [];

        // Generate the headers for Monday through Sunday
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            daysOfWeek.push(
                <th key={i} className="w-[6em]">
                    <p>{date.toLocaleDateString("en-US", { weekday: "long" })}</p>
                    <p>{date.getDate()}</p>
                </th>
            );
        }

        return <tr>{daysOfWeek}</tr>;
    };
    const generateTableRows = () => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const datesOfWeek = currentTutor ? getCurrentWeekSchedule(currentTutor.schedule) : [];
        const filteredDatesOfWeek: Date[] = [];
        classes.forEach((classItem) => {
            if (classItem.tutor === currentTutor?.username) {
                classItem.schedule.forEach((classTimestamp) => {
                    datesOfWeek.forEach((dateOfWeek) => {
                        if (classTimestamp.toDate().toString() === dateOfWeek.toString()) {
                            filteredDatesOfWeek.push(dateOfWeek);
                        }
                    });
                });
            }
        });
        console.log(filteredDatesOfWeek);

        return timeIntervals.map((interval, index) => (
            <tr key={index} className="text-white">
                {daysOfWeek.map((day) => {
                    const isInTutorSchedule = currentTutor?.schedule.includes(`${day}-${interval.split(" - ")[0].split(":")[0]}`);
                    const isInSelectedSchedule = selectedSchedule.includes(`${day}-${interval.split(" - ")[0].split(":")[0]}`);
                    // const isAlreadyOrdered = filteredDatesOfWeek.includes(convertTimeStringToTimestamp(`${day}-${interval.split(" - ")[0].split(":")[0]}`));
                    const isAlreadyOrdered = filteredDatesOfWeek.some((t) => t.toString() === convertTimeStringToTimestamp(`${day}-${interval.split(" - ")[0].split(":")[0]}`).toString());
                    // console.log(convertTimeStringToTimestamp(`${day}-${interval.split(" - ")[0].split(":")[0]}`));
                    // const isAlreadyOrdered = filteredDatesOfWeek.some((timestamp) => timestamp === convertTimeStringToTimestamp(`${day}-${interval.split(" - ")[0].split(":")[0]}`));

                    let currentStyle = "";

                    if (isInTutorSchedule) {
                        currentStyle = "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500";
                    }
                    if (isAlreadyOrdered) {
                        currentStyle = "rounded bg-gray-200 text-gray-500 ";
                    } else if (isInSelectedSchedule && isInTutorSchedule) {
                        currentStyle = "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500 hover:cursor-pointer transition";
                    }

                    return (
                        <td
                            key={`${day}-${interval}`}
                            className={currentStyle}
                            onClick={() => {
                                if (!isAlreadyOrdered) {
                                    currentTutor?.schedule.includes(`${day}-${interval.split(" - ")[0].split(":")[0]}`) && toggleSchedule(day, interval.split(" - ")[0].split(":")[0]);
                                }
                            }}
                        >
                            {interval}
                        </td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <>
            <div className={`w-[80%] min-h-full mx-auto mt-8 flex flex-col ${isModal && "blur-lg"}`}>
                <div className="flex justify-between">
                    <div className="flex">
                        <div>
                            <select
                                id="dropdown"
                                name="dropdown"
                                value={currentCategory}
                                onChange={(e) => {
                                    setCurrentCategory(e.target.value);
                                }}
                                className="block p-2 border rounded-md"
                            >
                                <option value="">All Category</option>
                                <option value="English">English</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Communication">Communication</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                            </select>
                        </div>
                        <div className="relative ms-4 w-96">
                            <input
                                type="text"
                                name=""
                                id=""
                                className="pl-8 pr-2 py-2 border rounded-md w-full"
                                placeholder="Search..."
                                onChange={(e) => {
                                    setInputSearch(e.target.value);
                                }}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 absolute left-2 top-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <p className="text-gray-500 me-4">Sort by: </p>
                        <div>
                            <select
                                id="dropdown"
                                name="dropdown"
                                value={selectedSort}
                                onChange={(e) => {
                                    setSelectedSort(e.target.value);
                                }}
                                className="block p-2 border rounded-md"
                            >
                                <option value="Trending">Trending</option>
                                <option value="Rating">Rating</option>
                                <option value="Price">Price</option>
                            </select>
                        </div>
                        <div className="ms-4">
                            <select
                                id="dropdown"
                                name="dropdown"
                                value={selectedSortDirection}
                                onChange={(e) => {
                                    setSelectedSortDirection(e.target.value);
                                }}
                                className="block p-2 border rounded-md"
                            >
                                <option value="Descending">Descending</option>
                                <option value="Ascending">Ascending</option>
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
                        <p className="font-medium">{filteredTutors.length.toLocaleString()}</p> <p className="mx-1">results found </p>
                    </div>
                </div>
                <div className="flex flex-wrap mt-4">
                    {filteredTutors.map((item, index) => {
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
                                    <img src={currentTutor?.imageUrl} alt="" className="object-cover h-full w-full rounded-lg" />
                                </div>
                                <h2 className="text-xl font-semibold mb-1">{currentTutor?.fullname} </h2>
                                <div className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[0.75em] rounded-md h-fit w-fit my-auto">{currentTutor?.subject}</div>
                                <p className="text-gray-700 text-sm mt-4">{currentTutor?.description}</p>
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
                        <div className="flex flex-col w-[70%] justify-between">
                            <table>
                                <thead>{generateHeader(currentDate)}</thead>
                                <tbody className="text-xs text-center text-gray-500 select-none">{generateTableRows()}</tbody>
                            </table>
                            <div className={`${selectedSchedule.length * currentTutor?.price != 0 && currentUser && (currentUser?.balance >= selectedSchedule.length * currentTutor?.price ? "text-green-400" : "text-red-400")}`}> Total Price : Rp. {(selectedSchedule.length * currentTutor?.price).toLocaleString()}</div>
                            <button
                                className={`transition mt-4  py-2 px-4 rounded  w-[50%] ${selectedSchedule.length * currentTutor?.price != 0 && currentUser?.balance >= selectedSchedule.length * currentTutor?.price ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-500"}`}
                                onClick={() => {
                                    if (selectedSchedule.length * currentTutor?.price != 0) {
                                        handleCheckoutButton(selectedSchedule.length * currentTutor?.price);
                                        setSelectedSchedule([]);
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
