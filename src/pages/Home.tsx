import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faLinkedin,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import db from "../firebase";

const cookies = new Cookies();

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  // Handle input changes
  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleContentChange = (event) => setContent(event.target.value);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submit action

    try {
      await addDoc(collection(db, "customerMessages"), {
        name,
        email,
        content,
        timestamp: serverTimestamp(),
      });
      // Clear the form fields after submission
      setName("");
      setEmail("");
      setContent("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  useEffect(() => {
    const userCookie = cookies.get("user");
    if (userCookie) {
      if (userCookie.role == "student") {
        navigate("/dashboard-student");
      } else if (userCookie.role == "tutor") {
        navigate("/dashboard-tutor");
      }
    }
  }, [navigate]);

  return (
    <div className="container mx-auto">
      <nav className="flex justify-between items-center p-4 shadow-md bg-white">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="mr-1 h-[2.8rem]" />{" "}
          {/* Replace with your logo image */}
          <span className="px-4 py-2 text-black text-lg font-bold">
            Studypal
          </span>
          <a href="/" className="px-4 py-2 text-gray-700 hover:text-blue-500">
            Home
          </a>
          <a
            href="/find-tutor"
            className="px-4 py-2 text-gray-700 hover:text-blue-500"
          >
            Find Tutors
          </a>
          <a
            href="/register-tutor"
            className="px-4 py-2 text-gray-700 hover:text-blue-500"
          >
            Become a Tutor
          </a>
        </div>
        <div>
          <Link
            to={`/login`}
            className="px-4 py-2 text-gray-700 hover:text-blue-500"
          >
            Log In
          </Link>
        </div>
      </nav>
      <header className="text-center p-10 bg-blue-200 grid grid-cols-2 gap-4">
        <div className="w-full flex items-center">
          <div className="w-3/4 mx-auto flex flex-wrap justify-start">
            <h1 className="text-left font-bold text-4xl mb-5">
              Unlock Your Learning Potential With The Best Tutors in Indonesia.
            </h1>
            <Link
              to="/register-student"
              className="px-4 py-2 bg-black text-white text-lg rounded-xl"
            >
              Get Started &#8680;
            </Link>
          </div>
        </div>
        <div>
          <img className="w-11/12" src="./homePage001.png"></img>
        </div>
      </header>
      <section>
        <div className="bg-white py-10">
          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center mb-10">
            <div>
              <p className="font-bold text-3xl">32,000+</p>
              <p>Experienced tutors</p>
            </div>
            <div>
              <p className="font-bold text-3xl">300,000+</p>
              <p>5-star tutor reviews</p>
            </div>
            <div>
              <p className="font-bold text-3xl">120+</p>
              <p>Subjects taught</p>
            </div>
            <div>
              <p className="font-bold text-3xl">180+</p>
              <p>Tutor nationalities</p>
            </div>
          </div>

          {/* Categories section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center w-11/12 mx-auto">
            {/* Repeat this block for each category */}
            <div className="border p-4 flex flex-row items-center hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="w-1/4">
                <img src="./ukFlag.png" alt="UK Flag" />
              </div>
              <div className="w-3/4">
                <div className="font-bold mb-2">English tutors</div>
                <div>17,264 teachers</div>
              </div>
            </div>
            <div className="border p-4 flex flex-row items-center hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="w-1/4">
                <img src="./frenchFlag.png" alt="French Flag" />
              </div>
              <div className="w-3/4">
                <div className="font-bold mb-2">French tutors</div>
                <div>2,353 teachers</div>
              </div>
            </div>
            <div className="border p-4 flex flex-row items-center hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="w-1/4">
                <img src="./germanFlag.png" alt="German Flag" />
              </div>
              <div className="w-3/4">
                <div className="font-bold mb-2">German tutors</div>
                <div>1,101 teachers</div>
              </div>
            </div>
            <div className="border p-4 flex flex-row items-center hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="w-1/4">
                <img src="./spanishFlag.png" alt="Spanish Flag" />
              </div>
              <div className="w-3/4">
                <div className="font-bold mb-2">Spanish tutors</div>
                <div>6,381 teachers</div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <button className="bg-white text-violet-500 hover:text-violet-600 active:text-violet-700 focus:outline-none focus:ring focus:ring-violet-300 px-6 py-2 rounded-full">
              Show more
            </button>
          </div>
        </div>
      </section>
      <section>
        <div className="bg-gray-100 py-10 px-10">
          <div className="text-center font-bold text-4xl mb-16">
            How Studypal works:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center px-4 md:px-0">
            {/* Step 1 */}
            <div className="flex flex-col items-center bg-white rounded-lg shadow-lg transform hover:-translate-y-2 transition duration-300">
              <div className="rounded-full h-16 w-16 flex items-center justify-center bg-green-500 text-white text-2xl font-bold mb-4 mt-6">
                1
              </div>
              <h3 className="font-bold text-xl mb-2">Find your tutor.</h3>
              <p className="px-6 mb-6">
                We'll connect you with a tutor who will motivate, challenge, and
                inspire you.
              </p>
              <img
                className="rounded-lg mb-6"
                src="./teacher_profile_placeholder_image.jpg"
                alt="Tutor profile"
              />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center bg-white rounded-lg shadow-lg transform hover:-translate-y-2 transition duration-300">
              <div className="rounded-full h-16 w-16 flex items-center justify-center bg-yellow-500 text-white text-2xl font-bold mb-4 mt-6">
                2
              </div>
              <h3 className="font-bold text-xl mb-2">Start learning.</h3>
              <p className="px-6 mb-6">
                Your tutor will guide the way through your first lesson and help
                you plan your next steps.
              </p>
              <img
                className="rounded-lg mb-6"
                src="./learning_session_placeholder_image.jpg"
                alt="Learning session"
              />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center bg-white rounded-lg shadow-lg transform hover:-translate-y-2 transition duration-300">
              <div className="rounded-full h-16 w-16 flex items-center justify-center bg-blue-500 text-white text-2xl font-bold mb-4 mt-6">
                3
              </div>
              <h3 className="font-bold text-xl mb-2">
                Speak. Read. Write. Repeat.
              </h3>
              <p className="px-6 mb-6">
                Choose how many lessons you want to take each week and get ready
                to reach your goals!
              </p>
              <img
                className="rounded-lg mb-6"
                src="./study_plan_placeholder_image.jpg"
                alt="Study plan"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-10/12 flex items-center bg-teal-600 text-white p-10 mx-auto rounded-lg shadow-xl">
          <div className="w-5/12 flex justify-center">
            <div className="relative">
              <div
                className="absolute -inset-1 bg-white blur"
                style={{ zIndex: -1 }}
              ></div>
              <img
                src="./tutor_placeholder_image.jpeg"
                alt="Become a tutor"
                className="rounded-xl relative z-10"
              />
            </div>
          </div>
          <div className="w-7/12 pl-10 pr-20">
            <h2 className="text-6xl font-bold mb-6 leading-tight">
              Become a tutor
            </h2>
            <p className="mb-4 text-lg">
              Earn money sharing your expert knowledge with students. Sign up to
              start tutoring online with Studypal.
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Find new students</li>
              <li>Grow your business</li>
              <li>Get paid securely</li>
            </ul>
            <button className="bg-black hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out flex items-center">
              <Link to="./register-tutor">Become a tutor</Link>
              <svg
                className="ml-3 w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
            <a
              href="#"
              className="text-sm text-teal-200 underline hover:text-teal-100 mt-4 inline-block transition-colors duration-300 ease-in-out"
            >
              How our platform works
            </a>
          </div>
        </div>
      </section>
      <section>
        {/* About Us Section */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-300 py-20 mt-16 text-white text-center">
          <h2 className="text-6xl font-extrabold mb-4">Discover Studypal</h2>
          <p className="text-xl mb-6">
            Connecting students and tutors globally.
          </p>
          <div className="w-10/12 mx-auto text-lg">
            <p>
              Studypal is dedicated to connecting students with the best tutors
              around the world. We believe in the power of education and the
              impact of one-on-one tutoring. Our mission is to make quality
              education accessible to everyone, everywhere.
            </p>
            <p className="mt-4">
              Founded in 2023, we have grown to support thousands of students
              and tutors, fostering a community where learning thrives.
            </p>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="bg-white py-10">
          <div className="text-center font-bold text-4xl mb-8">Contact Us</div>
          <div className="w-8/12 py-10 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <div className="bg-gray-100 px-8 pb-4 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold mb-6 text-blue-600">
                Get in Touch
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    placeholder="Your Message"
                    value={content}
                    onChange={handleContentChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Send Message
                </button>
              </form>
            </div>
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold mb-4 text-blue-600">
                Contact Information
              </h3>
              <p className="flex items-center text-lg">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mr-2 text-blue-500"
                />
                contact@studypal.com
              </p>
              <p className="flex items-center text-lg">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="mr-2 text-green-500"
                />
                +628999128428
              </p>
              <p className="flex items-center text-lg">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mr-2 text-red-500"
                />
                123 Education St, Harare City, Zimbabwe
              </p>
              <div className="mt-6">
                <h4 className="text-xl font-bold mb-4">Follow Us</h4>
                <div className="flex justify-start gap-4">
                  {/* Social Media Icons */}
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faFacebook} size="2x" />
                  </a>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-600"
                  >
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                  </a>
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faYoutube} size="2x" />
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                  <a
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black"
                  >
                    <FontAwesomeIcon icon={faTiktok} size="2x" />
                  </a>
                </div>
                <div className="text-md mt-24 font-semibold">
                  © 2023 PT Studypal Utama
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
