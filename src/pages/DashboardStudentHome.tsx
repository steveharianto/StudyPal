import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, where, doc, updateDoc, getDoc } from "firebase/firestore";
import db from "../firebase"; // Import your Firebase config
import { Container, Box, TextField, Button, Typography, Divider, Skeleton } from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const DashboardStudentHome = () => {
    const navigate = useNavigate();
    const { cookies, setBalance } = useOutletContext();
    const [user, setUser] = useState({});
    const [recommendedTutors, setRecommendedTutors] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);
    const [topUpAmount, setTopUpAmount] = useState(0);
    const topUpAmountRef = useRef(topUpAmount);

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
        }
    }, [user]);

    return (
        <>
            <main className="max-w-7xl mx-auto px-5 py-12 bg-gray-100">
                <section className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-blue-700 mb-4">Welcome Back, {user && user.fullname}!</h2>
                    <p className="text-xl text-gray-700">Your learning journey continues. Here's a quick overview:</p>
                </section>

                <section className="mb-10">
                    <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">Recommended Tutors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedTutors.length > 0
                            ? recommendedTutors.map((tutor, index) => (
                                  <div key={index} className="bg-white p-6 shadow-md rounded-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
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
        </>
    );
};

export default DashboardStudentHome;
