import { useEffect, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineBook,
  AiOutlineStar,
  AiOutlineLogout,
} from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import db from "../firebase";
import { User } from "../Types";

const cookies = new Cookies();

const DashboardStudent = () => {
  const navigate = useNavigate();
  const userCookie = cookies.get("admin");
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
    role: "",
    phoneNumber: "",
    balance: 0,
    dob: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const renderUsers = currentUsers.map((user) => (
    <tr className="bg-white border-b" key={user.id}>
      <td className="py-4 px-6">{user.fullname}</td>
      <td className="py-4 px-6">{user.email}</td>
      <td className="py-4 px-6">{user.role}</td>
      <td className="py-4 px-6">{user.username}</td>
      <td className="py-4 px-6">{user.balance}</td>
      <td className="py-4 px-6">{user.phoneNumber}</td>
      <td className="py-4 px-6">
        <button
          onClick={() => editUser(user)}
          className="font-medium text-blue-600 hover:underline mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => deleteUser(user.email)}
          className="font-medium text-red-600 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  const renderPageNumbers = Array.from({ length: totalPages }, (_, index) => (
    <li
      key={index + 1}
      className={`inline-block px-2 py-1 mx-1 border cursor-pointer ${
        index + 1 === currentPage
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-blue-300"
      }`}
      onClick={() => setCurrentPage(index + 1)}
    >
      {index + 1}
    </li>
  ));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createUser = async (user) => {
    try {
      // Check if user object has fullname attribute
      if (user && user.fullname) {
        // Generate username: convert to lowercase and remove spaces
        user.username = user.fullname.toLowerCase().replace(/\s+/g, "");
      }

      await addDoc(usersCollectionRef, user);
      // Optionally, refresh the user list or handle UI updates
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const fetchUsers = async () => {
    const getUsers = await getDocs(query(usersCollectionRef));
    const usersList: User[] = getUsers.docs.map((c) => c.data() as User);

    setUsers(usersList);
  };
  const updateUser = async (email, updatedUser) => {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(userQuery);
    const userDocs = querySnapshot.docs.find((doc) => doc.exists);

    if (!userDocs) {
      alert("Akun dengan email tersebut tidak ditemukan");
      return;
    }

    await updateDoc(userDocs.ref, updatedUser);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userCookie) {
        navigate("/");
        return;
      }
    };

    fetchUserData();
    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      // Update user logic here
      await updateUser(formData.email, formData);
    } else {
      // Create new user logic here
      await createUser(formData);
    }

    // Reset form and update UI
    setFormData({
      username: "",
      password: "",
      fullname: "",
      email: "",
      role: "",
      phoneNumber: "",
      balance: 0,
      dob: null,
    });
    setIsEditing(false);
    fetchUsers(); // Re-fetch users to update the list
  };
  const editUser = (user) => {
    setFormData(user);
    setIsEditing(true);
  };

  const deleteUser = async (email) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUserFromFirebase(email);
      fetchUsers(); // Re-fetch users to update the list
    }
  };

  const deleteUserFromFirebase = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        await deleteDoc(doc.ref); // Delete the document
      });
      // Optionally, refresh the user list or handle UI updates here
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <div className="bg-gray-50 h-screen">
      <header className="bg-blue-700 py-4 h-[10vh]">
        <div className="h-full mx-auto px-4">
          <nav className="h-full flex text-white text-lg justify-between items-center">
            <div></div>
            <button
              onClick={() => {
                cookies.remove("admin", { path: "/" });
                navigate("/");
              }}
              className="flex items-center space-x-2 hover:text-blue-300"
            >
              <AiOutlineLogout className="text-xl" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>
      <div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Full Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Email
                </th>
                <th scope="col" className="py-3 px-6">
                  Role
                </th>
                <th scope="col" className="py-3 px-6">
                  Username
                </th>
                <th scope="col" className="py-3 px-6">
                  Balance
                </th>
                <th scope="col" className="py-3 px-6">
                  Phone Number
                </th>
                <th scope="col" className="py-3 px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>{renderUsers}</tbody>
            <ul className="flex mt-4">{renderPageNumbers}</ul>
          </table>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 mx-16">
            <p className="font-bold text-xl mt-8">
              {isEditing ? "Edit Form" : "Add User Form"}
            </p>
            <div className=" shadow-sm space-y-4">
              <div>
                <label htmlFor="fullname" className="sr-only">
                  Full Name
                </label>
                <input
                  id="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  name="fullname"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="role" className="sr-only">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                >
                  <option value="">Select role</option>
                  <option value="tutor">Tutor</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label htmlFor="balance" className="sr-only">
                  Balance
                </label>
                <input
                  id="balance"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  type="number"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Balance"
                />
              </div>
              <div>
                <label htmlFor="dob" className="sr-only">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Date of Birth"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isEditing ? "Update User" : "Add User"}
              </button>
              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);

                    setFormData({
                      username: "",
                      password: "",
                      fullname: "",
                      email: "",
                      role: "",
                      phoneNumber: "",
                      balance: 0,
                      dob: null,
                    });
                  }}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-400 mt-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
