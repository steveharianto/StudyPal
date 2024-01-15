import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, where, doc, updateDoc, getDoc, addDoc } from "firebase/firestore";
import db from "../firebase"; // Import your Firebase config
import { Container, Box, TextField, Button, Typography, Divider, Skeleton } from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Tutor, Classes } from "../Types";
import { getCurrentWeekSchedule, convertTimeStringToTimestamp } from "../utils";

const DashboardStudentHome = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const { cookies, setBalance } = useOutletContext();
    const ClassCollectionRef = collection(db, "class");
    const UsersCollectionRef = collection(db, "users");

    const [user, setUser] = useState({});
    const [classes, setClasses] = useState<Classes[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<string[]>([]);
    const [recommendedTutors, setRecommendedTutors] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);
    const [topUpAmount, setTopUpAmount] = useState(0);

    const [isModal, setIsModal] = useState(false);
    const [currentTutor, setCurrentTutor] = useState<Tutor>();
    const timeIntervals = ["00:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00", "05:00 - 06:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"];

    const topUpAmountRef = useRef(topUpAmount);
    const handleCheckoutButton = async (price: number) => {
        // is Logged in?
        if (user == null) {
            navigate("/login");
            return;
        }
        // Enough Balance?
        if (user.balance < price) {
            alert("insufficient balance");
            return;
        }
        // Add Class
        await addDoc(ClassCollectionRef, {
            schedule: getCurrentWeekSchedule(selectedSchedule),
            student: user.username,
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
                        ...user, // Assuming you have a function to get the user object from the cookie
                        balance: newBalance,
                    };

                    cookies.set("user", updatedUser, { path: "/" });
                    setUser(updatedUser);
                } else {
                    console.log("User not found.");
                }
            })
            .catch((error) => {
                console.error("Error querying user: ", error);
            });
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

    const fetchTutors = async () => {
        try {
            // Query for the highest-rated tutors who are also tutors by role
            const ratedTutorsQuery = query(collection(db, "users"), where("role", "==", "tutor"), orderBy("rating", "desc"), limit(3));
            const querySnapshot = await getDocs(ratedTutorsQuery);
            let tutors = [];
            querySnapshot.forEach((doc) => {
                tutors.push(doc.data());
            });

            // If there are less than 3 rated tutors, fetch older tutors
            if (tutors.length < 3) {
                const additionalTutorsNeeded = 3 - tutors.length;
                const olderTutorsQuery = query(collection(db, "users"), where("role", "==", "tutor"), orderBy("dob"), limit(additionalTutorsNeeded));
                const ageQuerySnapshot = await getDocs(olderTutorsQuery);
                ageQuerySnapshot.forEach((doc) => {
                    tutors.push(doc.data());
                });
            }

            setRecommendedTutors(tutors);
        } catch (error) {
            console.error("Error fetching tutors: ", error);
        }
    };

    const fetchClasses = async () => {
        const classesSnapshot = await getDocs(query(collection(db, "class")));
        const tempClass: Classes[] = [];
        classesSnapshot.forEach((doc) => {
            tempClass.push(doc.data() as Classes);
        });
        setClasses(tempClass);
    };

    const fetchRecentMessages = async () => {
        try {
            const messagesQuery = query(
                collection(db, "messages"), // Assuming 'messages' is your collection
                where("receiver", "==", user.username), // Filter messages for the logged-in user
                orderBy("timestamp", "desc"), // Order by timestamp
                limit(5) // Limit the number of messages
            );
            const querySnapshot = await getDocs(messagesQuery);
            let fetchedMessages = [];
            querySnapshot.forEach((doc) => {
                const message = doc.data();
                // Convert Firestore Timestamp to JavaScript Date object
                message.timestamp = message.timestamp.toDate();
                fetchedMessages.push(message);
            });
            setRecentMessages(fetchedMessages);
        } catch (error) {
            console.error("Error fetching recent messages: ", error);
        }
    };

    const handleTopUp = async (newBalance) => {
        if (newBalance <= 0) {
            alert("Please enter a valid amount to top up.");
            return;
        }

        // Ensure that the user's data is available
        if (!user || !user.username) {
            alert("User information is not available.");
            return;
        }

        try {
            // Query for the user document by username
            const userQuery = query(collection(db, "users"), where("username", "==", user.username));
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) {
                alert("User not found.");
                return;
            }

            // Assuming only one document will be returned for a unique username
            const userDocRef = querySnapshot.docs[0].ref;

            const currentUserData = querySnapshot.docs[0].data();
            const updatedBalance = newBalance;

            // Update the user document with the new balance
            await updateDoc(userDocRef, {
                balance: updatedBalance,
            });

            // Update the local state to reflect the new balance
            setUser({ ...user, balance: updatedBalance });

            // Optionally, update the cookie with the new balance
            cookies.set("user", { ...user, balance: updatedBalance }, { path: "/" });
            setBalance(updatedBalance);

            setTopUpAmount(0);
            alert("Top up successful!");
        } catch (error) {
            console.error("Error updating balance: ", error);
            alert("Failed to top up balance.");
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        const userCookie = cookies.get("user");
        if (userCookie) {
            setUser({
                username: userCookie.username,
                fullname: userCookie.fullname,
                email: userCookie.email,
                role: userCookie.role,
                dateOfBirth: userCookie.dateOfBirth,
                phoneNumber: userCookie.phoneNumber,
                balance: userCookie.balance,
            });
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        topUpAmountRef.current = topUpAmount;
    }, [topUpAmount]);

    useEffect(() => {
        if (user && user.username) {
            fetchRecentMessages();
            fetchTutors();
            fetchClasses();
        }
    }, [user]);

    return (
        <>
            <main className="mx-auto px-10 py-12 bg-gray-100">
                <section className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-blue-700 mb-4">Welcome Back, {user && user.fullname}!</h2>
                    <p className="text-xl text-gray-700">Your learning journey continues. Here's a quick overview:</p>
                </section>

                <section className="mb-10">
                    <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">Recommended Tutors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedTutors.length > 0
                            ? recommendedTutors.map((tutor, index) => (
                                  <div
                                      key={index}
                                      className="bg-white p-6 shadow-md rounded-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                                      onClick={() => {
                                          setIsModal(true);
                                          setCurrentTutor(tutor);
                                      }}
                                  >
                                      <img src={tutor.imageUrl} alt={`Image of ${tutor.fullname}`} className="w-full h-60 object-cover rounded-lg mb-4" />
                                      <h4 className="font-semibold text-lg text-green-600 mb-2">{tutor.fullname}</h4>
                                      <p className="text-gray-700">Subject: {tutor.subject}</p>
                                      <p className="text-gray-700">Price: {formatRupiah(tutor.price)} / Session</p>
                                  </div>
                              ))
                            : // Skeleton loaders
                              Array.from(new Array(3)).map((_, index) => (
                                  <div key={index} className="bg-white p-6 shadow-md rounded-lg">
                                      <Skeleton
                                          variant="rectangular"
                                          width="100%"
                                          height={200}
                                          animation="wave" // Wave animation
                                          sx={{ bgcolor: "grey.600" }} // Custom background color
                                      />
                                      <Skeleton variant="text" animation="wave" />
                                      <Skeleton variant="text" animation="wave" />
                                      <Skeleton variant="text" animation="wave" />
                                  </div>
                              ))}
                    </div>
                </section>

                <section className="mb-10">
                    <h3 className="text-2xl font-bold text-orange-600 mb-6 text-center">Recent Messages</h3>
                    {!recentMessages ? (
                        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                            <p className="text-gray-700">Loading...</p>
                        </div>
                    ) : recentMessages.length > 0 ? (
                        <div className="space-y-4">
                            {recentMessages.map((message, index) => (
                                <div key={index} className="bg-gradient-to-r from-blue-200 to-indigo-200 p-6 shadow-md rounded-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                                    <p className="text-gray-800 font-semibold">
                                        {message.sender} - <span className="text-gray-700">{new Date(message.timestamp).toLocaleString()}</span>
                                    </p>
                                    <p className="text-gray-700 mt-2">{message.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                            <p className="text-gray-700">No new messages.</p>
                        </div>
                    )}
                </section>

                <PayPalScriptProvider
                    options={{
                        "client-id": "Ac-x8-sk6tmBazXGaoRvziAn8tgimUUz-Iz3fx3v7leJA3QoGcWOMBHQzbA_PxS2PBoPilUx5jPUSpRy",
                    }}
                >
                    <Container maxWidth="sm" sx={{ mt: 4 }}>
                        <Box>
                            <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: "bold", color: "teal" }}>
                                Top Up Balance
                            </Typography>
                            <Divider sx={{ width: "100%", mb: 3 }} />
                            <TextField label="Enter Amount" variant="outlined" type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(Number(e.target.value))} sx={{ width: "100%", mb: 2 }} />
                            <PayPalButtons
                                createOrder={(data, actions) => {
                                    const formattedAmount = parseFloat(topUpAmountRef.current).toFixed(2);
                                    if (formattedAmount <= 0) {
                                        alert("Please enter a valid amount to top up.");
                                        return Promise.reject(new Error("Invalid amount"));
                                    }
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: formattedAmount,
                                                },
                                            },
                                        ],
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                        console.log("Transaction completed by " + details.payer.name.given_name);
                                        const newBalance = user.balance + topUpAmountRef.current; // Use ref value here
                                        console.log(newBalance);
                                        handleTopUp(newBalance);
                                    });
                                }}
                                onError={(error) => {
                                    console.error("PayPal Button Error:", error);
                                }}
                            />
                        </Box>
                    </Container>
                </PayPalScriptProvider>
            </main>
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
                            <div className={`${selectedSchedule.length * currentTutor.price != 0 && currentUser && (currentUser?.balance >= selectedSchedule.length * currentTutor.price ? "text-green-400" : "text-red-400")}`}> Total Price : Rp. {(selectedSchedule.length * currentTutor.price).toLocaleString()}</div>
                            <button
                                className={`transition mt-4  py-2 px-4 rounded  w-[50%] ${selectedSchedule.length * currentTutor.price != 0 && currentUser?.balance >= selectedSchedule.length * currentTutor.price ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-500"}`}
                                onClick={() => {
                                    if (selectedSchedule.length * currentTutor.price != 0) {
                                        handleCheckoutButton(selectedSchedule.length * currentTutor.price);
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

export default DashboardStudentHome;
