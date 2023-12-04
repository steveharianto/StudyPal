import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const DashboardStudentHome = () => {
  const navigate = useNavigate();
  const { cookies } = useOutletContext();
  const [user, setUser] = useState({});

  const recommendedTutors = [
    {
      name: "Mr. Johnson",
      subject: "Mathematics",
      price: "$40/hour",
      imageUrl:
        "https://thefutureispublictransport.org/wp-content/uploads/2022/09/Story-C40-SiteImage_04.jpg",
    },
    {
      name: "Ms. Davis",
      subject: "Physics",
      price: "$35/hour",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Megawati_Sukarnoputri_official_portrait.jpg/735px-Megawati_Sukarnoputri_official_portrait.jpg",
    },
    {
      name: "Dr. Thompson",
      subject: "Chemistry",
      price: "$45/hour",
      imageUrl:
        "https://asset.kompas.com/crops/A0qds-2BjWmU4g8xkkxJANW0Zmo=/0x0:0x0/750x500/data/photo/2022/10/24/635673c468c46.jpg",
    },
    // Add more tutors and lessons as needed
  ];

  const recentMessages = [
    {
      sender: "Instructor Smith",
      date: "Nov 21, 2023, 10:30 AM",
      content: "Don't forget to review the latest module on Algebra.",
    },
    {
      sender: "Classmate Jane",
      date: "Nov 20, 2023, 8:15 PM",
      content: "Hey, are you joining the group study session tomorrow?",
    },
    {
      sender: "Learning Support",
      date: "Nov 19, 2023, 3:45 PM",
      content:
        "Your request for additional resources has been approved. Check your email for details.",
    },
    // Add more messages as needed
  ];

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
      })
    } else {
      navigate('/');
    }
  }, [])

  return (
    <>
      <main className="max-w-7xl mx-auto px-5 py-12 bg-gray-100">
        <section className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-4">
            Welcome Back, {user && user.fullname}!
          </h2>
          <p className="text-xl text-gray-700">
            Your learning journey continues. Here's a quick overview:
          </p>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">
            Recommended Tutors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedTutors.map((tutor, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-md rounded-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              >
                <img
                  src={tutor.imageUrl}
                  alt={`Image of ${tutor.name}`}
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
                <h4 className="font-semibold text-lg text-green-600 mb-2">
                  {tutor.name}
                </h4>
                <p className="text-gray-700">Subject: {tutor.subject}</p>
                <p className="text-gray-700">Price: {tutor.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold text-orange-600 mb-6 text-center">
            Recent Messages
          </h3>
          {recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-200 to-indigo-200 p-6 shadow-md rounded-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  <p className="text-gray-800 font-semibold">
                    {message.sender} -{" "}
                    <span className="text-gray-700">{message.date}</span>
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

        <section className="text-center">
          <h3 className="text-2xl font-bold text-teal-700 mb-6">Quick Links</h3>
          <div className="flex justify-center flex-wrap gap-4">
            <a
              href="#"
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg hover:bg-gradient-to-l transition-colors duration-300 ease-in-out"
            >
              Link 1
            </a>
            <a
              href="#"
              className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-3 rounded-lg hover:bg-gradient-to-l transition-colors duration-300 ease-in-out"
            >
              Link 2
            </a>
            {/* Add more links as needed */}
          </div>
        </section>
      </main>
    </>
  );
};

export default DashboardStudentHome;
