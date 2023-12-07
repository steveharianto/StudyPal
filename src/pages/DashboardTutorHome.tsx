import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import db from "../firebase";
import { Classes, Rating, User } from "../Types";

function DashboardTutorHome() {
    const cookies = new Cookies();
    const userCookie = cookies.get("user");

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [classes, setClasses] = useState<Classes[]>([]);
    const [rating, setRating] = useState<Rating[]>([]);
    const [earnings, setEarnings] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCurrentUser = () => {
        if (userCookie) {
            setCurrentUser(userCookie);
        }
    };
    const fetchClasses = async () => {
        const classesSnapshot = await getDocs(query(collection(db, "class"), where("tutor", "==", userCookie.username)));
        const tempClass: Classes[] = [];
        let totalEarnings = 0;

        classesSnapshot.forEach((doc) => {
            const classData = doc.data() as Classes;
            tempClass.push(classData);

            // Calculate Total Earnings
            totalEarnings += classData.schedule.length * userCookie.price;
        });

        setClasses(tempClass);
        setEarnings(totalEarnings);
    };
    const fetchrating = async () => {
        const ratingSnapshot = await getDocs(query(collection(db, "rating"), where("tutor", "==", userCookie.username)));
        const tempRating: Rating[] = [];
        ratingSnapshot.forEach((doc) => {
            tempRating.push(doc.data() as Rating);
        });
        setRating(tempRating);
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchClasses();
        fetchrating();
        setIsLoading(false);
    }, []);
    return (
        <>
            {isLoading && <div>Loading...</div>}
            {!isLoading && (
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-x-20">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Stats</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <div className="p-4 bg-green-100 rounded-xl">
                                        <div className="font-bold text-xl text-gray-800 leading-none">Good day, {currentUser?.fullname}</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                                    <div className="font-bold text-2xl leading-none">{classes.length}</div>
                                    <div className="mt-2">Lessons Finished</div>
                                </div>
                                <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                                    <div className="font-bold text-2xl leading-none">{rating.length == 0 ? "0" : rating.reduce((acc, rating) => acc + rating.value, 0) / rating.length}</div>
                                    <div className="mt-2">Average Rating</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="p-4 bg-purple-100 rounded-xl text-gray-800">
                                        <div className="font-bold text-xl leading-none">Your Total Earnings</div>
                                        <div className="mt-2">Rp. {earnings.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Your Recent Messages</h2>

                            <div className="space-y-4">
                                <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                                    <a href="javascript:void(0)" className="font-bold hover:text-yellow-800 hover:underline">
                                        Kevin
                                    </a>
                                    <div className="flex justify-between">
                                        <div className="text-gray-400 text-xs">Ko ini gimana kalo misal pake div?</div>
                                        <div className="text-gray-400 text-xs">1h</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                                    <a href="javascript:void(0)" className="font-bold hover:text-yellow-800 hover:underline">
                                        Alex
                                    </a>
                                    <div className="flex justify-between">
                                        <div className="text-gray-400 text-xs">Ko kenapa kok ini gabisa ya?</div>
                                        <div className="text-gray-400 text-xs">2h</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                                    <a href="javascript:void(0)" className="font-bold hover:text-yellow-800 hover:underline">
                                        Kenneth
                                    </a>
                                    <div className="flex justify-between">
                                        <div className="text-gray-400 text-xs">sori ko aku gabisa dateng aku ketumpuk praktikum</div>
                                        <div className="text-gray-400 text-xs">4h</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DashboardTutorHome;
