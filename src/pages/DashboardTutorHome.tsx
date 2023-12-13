import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
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
  const [recentMessages, setRecentMessages] = useState([]);

  const fetchCurrentUser = () => {
    if (userCookie) {
      setCurrentUser(userCookie);
    }
  };
  const fetchClasses = async () => {
    const classesSnapshot = await getDocs(
      query(collection(db, "class"), where("tutor", "==", userCookie.username))
    );
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
    const ratingSnapshot = await getDocs(
      query(collection(db, "rating"), where("tutor", "==", userCookie.username))
    );
    const tempRating: Rating[] = [];
    ratingSnapshot.forEach((doc) => {
      tempRating.push(doc.data() as Rating);
    });
    setRating(tempRating);
  };

  const fetchRecentMessages = async () => {
    const messagesQuery = query(
      collection(db, "messages"),
      where("receiver", "==", userCookie.username),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(messagesQuery);
    const fetchedMessages = [];
    querySnapshot.forEach((doc) => {
      fetchedMessages.push(doc.data());
    });
    setRecentMessages(fetchedMessages);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchClasses();
    fetchrating();
    fetchRecentMessages();
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
                    <div className="font-bold text-xl text-gray-800 leading-none">
                      Good day, {currentUser?.fullname}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                  <div className="font-bold text-2xl leading-none">
                    {classes.length}
                  </div>
                  <div className="mt-2">Lessons Finished</div>
                </div>
                <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                  <div className="font-bold text-2xl leading-none">
                    {rating.length == 0
                      ? "0"
                      : rating.reduce((acc, rating) => acc + rating.value, 0) /
                        rating.length}
                  </div>
                  <div className="mt-2">Average Rating</div>
                </div>
                <div className="col-span-2">
                  <div className="p-4 bg-purple-100 rounded-xl text-gray-800">
                    <div className="font-bold text-xl leading-none">
                      Your Total Earnings
                    </div>
                    <div className="mt-2">Rp. {earnings.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Recent Messages</h2>
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border rounded-xl text-gray-800 space-y-2"
                  >
                    <a
                      href="javascript:void(0)"
                      className="font-bold hover:text-yellow-800 hover:underline"
                    >
                      {message.sender}
                    </a>
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-xs">
                        {message.content}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(
                          message.timestamp.seconds * 1000
                        ).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardTutorHome;
