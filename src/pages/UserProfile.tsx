import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import avatar from "../assets/avatar.jpg";
import PPModal from "../components/PPModal";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from "@firebase/firestore";
import db from "../firebase";
import image from "../assets/login.png";
import google from "../assets/google.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Tutor } from "../Types";

const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.number().required(),
}).unknown(true);

const cookies = new Cookies();
const UsersCollectionRef = collection(db, "users");

function UserProfile() {
    const currentDate = new Date();
    const timeIntervals = ["00:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00", "05:00 - 06:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"];

    const [showPassword, setShowPassword] = useState(false);
    const [tutor, setTutor] = useState<Tutor>();
    const [modal, setModal] = useState(false);
    const [scheduleModal, setScheduleModal] = useState(false);
    const navigate = useNavigate();
    const userCookie = cookies.get("user");

    useEffect(() => {
        if (!userCookie) {
            navigate("/");
            return;
        }

        if (userCookie.role == "tutor") {
            const q = query(UsersCollectionRef, where("email", "==", userCookie.email));

            getDocs(q).then((querySnapshot) => {
                // Check if documents were found
                if (querySnapshot.empty) {
                    console.log("No matching documents found");
                    return;
                }

                querySnapshot.forEach((doc) => {
                    // Get the document data
                    const data = doc.data();
                    console.log(data);
                    setTutor(data);
                });
            });
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: joiResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            // Check if user exists with email
            const userQuery = query(UsersCollectionRef, where("email", "==", data.email));
            const querySnapshot = await getDocs(userQuery);
            const userDoc = querySnapshot.docs.find((doc) => doc.exists);

            if (!userDoc) {
                alert("Akun dengan email tersebut tidak ditemukan");
                return;
            }

            //console.log(userDoc);

            if (!userDoc) {
                alert("Akun dengan email tersebut tidak ditemukan");
                return;
            }

            // Update user data using document reference
            const updates = { username: data.username, phoneNumber: data.phone };
            if (data.newpass && data.newpass !== "") {
                updates.password = data.newpass;
            }

            await updateDoc(userDoc.ref, updates);
            // Update the userCookie with the new username
            const updatedUserCookie = {
                ...userCookie,
                username: data.username,
                phoneNumber: data.phone,
            };
            cookies.set("user", updatedUserCookie, { path: "/" });
            alert("Berhasil di update");
            location.reload();
        } catch (error) {
            console.error(error);
            alert("Internal server error");
        }
    };
    const updateTutor = async () => {
        try {
            // Check if user exists with email
            const userQuery = query(UsersCollectionRef, where("email", "==", tutor?.email));
            const querySnapshot = await getDocs(userQuery);
            const userDoc = querySnapshot.docs.find((doc) => doc.exists);

            if (!userDoc) {
                alert("Akun dengan email tersebut tidak ditemukan");
                return;
            }

            // Update user data using document reference
            const updates = { schedule: tutor?.schedule };

            await updateDoc(userDoc.ref, updates);
            // Update the userCookie with the new username
            const updatedUserCookie = {
                ...userCookie,
                schedule: tutor?.schedule,
            };
            cookies.set("user", updatedUserCookie, { path: "/" });
            alert("Berhasil di update");
        } catch (error) {
            console.error(error);
            alert("Internal server error");
        }
    };

    const generateHeader = () => {
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
                </th>
            );
        }

        return <tr>{daysOfWeek}</tr>;
    };
    const toggleSchedule = (schedule: string) => {
        // Check if the schedule is already in the tutor's schedule
        const index = tutor.schedule.indexOf(schedule);

        if (index !== -1) {
            // If it's already in the schedule, remove it
            const newSchedule = [...tutor.schedule];
            newSchedule.splice(index, 1);
            setTutor({ ...tutor, schedule: newSchedule });
        } else {
            // If it's not in the schedule, add it
            setTutor({ ...tutor, schedule: [...tutor.schedule, schedule] });
        }
    };

    const generateTableRows = () => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        return timeIntervals.map((interval, index) => (
            <tr key={index} className="text-white">
                {daysOfWeek.map((day) => {
                    const isInTutorSchedule = tutor?.schedule.includes(`${day}-${interval.split(" - ")[0].split(":")[0]}`);
                    let currentStyle = "rounded hover:bg-blue-300 hover:cursor-pointer transition text-gray-500";

                    if (isInTutorSchedule) {
                        currentStyle = "bg-blue-500 rounded font-medium text-white hover:bg-gray-200 hover:text-gray-500 hover:cursor-pointer transition";
                    }

                    return (
                        <td
                            key={`${day}-${interval}`}
                            className={currentStyle}
                            onClick={() => {
                                toggleSchedule(`${day}-${interval.split(" - ")[0].split(":")[0]}`);
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
            <div className="grid grid-cols-1 lg:grid-cols-5 w-auto h-4/5">
                <div className="lg:col-span-3 flex justify-end pr-10 bg-white max-h-screen">
                    <div className="w-full max-w-md p-1 mb-5">
                        <h2 className="text-3xl font-bold mb-6 mt-5 text-indigo-800">My Account</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Email */}
                            <label className="block text-pink-600 text-sm font-medium mb-2" htmlFor="email">
                                Email
                            </label>
                            <input id="email" type="text" readOnly={true} {...register("email")} className={`mb-1 p-2 pl-0 w-full outline-none`} value={userCookie.email}></input>

                            {/* Username */}
                            <label className="block text-pink-600 text-sm font-medium mb-2">Username</label>
                            <input id="username" {...register("username")} type="text" className={`mb-1 p-3 w-full rounded border border-pink-300 focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`} defaultValue={userCookie.username}></input>

                            {/* Phone */}
                            <label className="block text-pink-600 text-sm font-medium mb-2">Phone Number</label>
                            <input id="phone" {...register("phone")} type="tel" className={`mb-1 p-3 w-full rounded border border-pink-300 focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`} defaultValue={userCookie.phoneNumber}></input>

                            {/* Password */}
                            <label className="block text-pink-600 text-sm font-medium mb-2" htmlFor="password">
                                Current Password <i>(required)</i>
                            </label>
                            <div className="relative">
                                <input id="password" {...register("password")} type={showPassword ? "text" : "password"} className={`mb-1 p-3 w-full rounded border ${errors.password ? "border-red-500" : "border-pink-300"} focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`} placeholder="Enter your password"></input>
                            </div>

                            {/* New Password */}
                            <label className="block text-pink-600 text-sm font-medium mb-2" htmlFor="password">
                                New Password <i>(optional)</i>
                            </label>
                            <div className="relative">
                                <input id="newpass" {...register("newpass")} type={showPassword ? "text" : "password"} placeholder="Enter your new password" className={`mb-1 p-3 w-full rounded border ${errors.password ? "border-red-500" : "border-pink-300"} focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`}></input>
                            </div>

                            <button type="submit" className="mt-3 w-full py-3 px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200">
                                Update Account Profile
                            </button>
                            <button
                                className="mt-3 w-full py-3 px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200"
                                onClick={() => {
                                    setScheduleModal(true);
                                }}
                            >
                                Update Schedule
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 hidden lg:block bg-white p-1">
                    <div className="w-48 h-56 ml-10 mt-5 bg-slate-100 flex flex-col items-center justify-center">
                        {userCookie.role === "student" && <img src={avatar} className="w-36 border-2 border-gray-300" />}
                        {userCookie.role === "tutor" && tutor && <img src={tutor.imageUrl} className="w-36 border-2 max-h-40 border-gray-300" style={{ overflow: "hidden", objectFit: "cover" }} />}
                        <p className="text-xs mt-3 text-slate-500 hover:underline" style={{ cursor: "pointer" }} onClick={() => setModal(true)}>
                            Change Profile Picture
                        </p>
                    </div>
                </div>
                {modal && <PPModal setModal={setModal} />}
                {scheduleModal && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white w-[70em] h-[40em] p-4 rounded-lg shadow-lg flex flex-col justify-between overflow-y-auto">
                            <table>
                                <thead>{generateHeader()}</thead>
                                <tbody className="text-xs text-center text-gray-500 select-none">{generateTableRows()}</tbody>
                            </table>

                            <div className="flex">
                                <button
                                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 me-4"
                                    onClick={() => {
                                        setScheduleModal(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`transition mt-4  py-2 px-4 rounded  w-[50%] bg-blue-500 text-white hover:bg-blue-600`}
                                    onClick={() => {
                                        setScheduleModal(false);
                                        updateTutor();
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default UserProfile;
