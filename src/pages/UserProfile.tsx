import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import avatar from "../assets/avatar.jpg";
import PPModal from "../components/PPModal";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "@firebase/firestore";
import db from "../firebase";
import image from "../assets/login.png";
import google from "../assets/google.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.number().required(),
}).unknown(true);

const cookies = new Cookies();
const UsersCollectionRef = collection(db, "users");

function UserProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [tutor, setTutor] = useState();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const userCookie = cookies.get("user");

  useEffect(() => {
    if (!userCookie) {
      navigate("/");
      return;
    }

    if (userCookie.role == "tutor") {
      const q = query(
        UsersCollectionRef,
        where("email", "==", userCookie.email)
      );

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
      const userQuery = query(
        UsersCollectionRef,
        where("email", "==", data.email)
      );
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 w-auto h-4/5">
        <div className="lg:col-span-3 flex justify-end pr-10 bg-white max-h-screen">
          <div className="w-full max-w-md p-1 mb-5">
            <h2 className="text-3xl font-bold mb-6 mt-5 text-indigo-800">
              My Account
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <label
                className="block text-pink-600 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                readOnly={true}
                {...register("email")}
                className={`mb-1 p-2 pl-0 w-full outline-none`}
                value={userCookie.email}
              ></input>

              {/* Username */}
              <label className="block text-pink-600 text-sm font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                {...register("username")}
                type="text"
                className={`mb-1 p-3 w-full rounded border border-pink-300 focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`}
                defaultValue={userCookie.username}
              ></input>

              {/* Phone */}
              <label className="block text-pink-600 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                {...register("phone")}
                type="tel"
                className={`mb-1 p-3 w-full rounded border border-pink-300 focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`}
                defaultValue={userCookie.phoneNumber}
              ></input>

              {/* Password */}
              <label
                className="block text-pink-600 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Current Password <i>(required)</i>
              </label>
              <div className="relative">
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`mb-1 p-3 w-full rounded border ${
                    errors.password ? "border-red-500" : "border-pink-300"
                  } focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`}
                  placeholder="Enter your password"
                ></input>
              </div>

              {/* New Password */}
              <label
                className="block text-pink-600 text-sm font-medium mb-2"
                htmlFor="password"
              >
                New Password <i>(optional)</i>
              </label>
              <div className="relative">
                <input
                  id="newpass"
                  {...register("newpass")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className={`mb-1 p-3 w-full rounded border ${
                    errors.password ? "border-red-500" : "border-pink-300"
                  } focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`}
                ></input>
              </div>

              <button
                type="submit"
                className="mt-3 w-full py-3 px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200"
              >
                Update Account Profile
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 hidden lg:block bg-white p-1">
          <div className="w-48 h-56 ml-10 mt-5 bg-slate-100 flex flex-col items-center justify-center">
            {userCookie.role === "student" && (
              <img src={avatar} className="w-36 border-2 border-gray-300" />
            )}
            {userCookie.role === "tutor" && tutor && (
              <img
                src={tutor.imageUrl}
                className="w-36 border-2 max-h-40 border-gray-300"
                style={{ overflow: "hidden", objectFit: "cover" }}
              />
            )}
            <p
              className="text-xs mt-3 text-slate-500 hover:underline"
              style={{ cursor: "pointer" }}
              onClick={() => setModal(true)}
            >
              Change Profile Picture
            </p>
          </div>
        </div>
        {modal && <PPModal setModal={setModal} />}
      </div>
    </>
  );
}

export default UserProfile;
