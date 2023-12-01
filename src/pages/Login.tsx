import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "@firebase/firestore";
import db from "../firebase";
import image from "../assets/login.png";
import google from "../assets/google.png";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

// Joi schema for form validation
const UsersCollectionRef = collection(db, "users");

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).required(),
});

const Login = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    const users = await getDocs(UsersCollectionRef);
    const targetUser = users.docs.find(
      (elem) => elem.email == data.username && elem.password == data.password
    );
    if (targetUser) {
      if (targetUser.role == "student") {
        navigate(`/dashboard-student`);
      } else if (targetUser.role == "tutor") {
        navigate("dashboard-tutor");
      } else {
        setModalContent("Internal Server Error, please contact customer service");
        setOpen(true);
      }
    } else {
      setModalContent("User not found or password incorrect");
      setOpen(true);
    }
    console.log(users.docs.map((elem) => ({ ...elem.data(), id: elem.id })));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 w-full h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-teal-300">
        <div className="lg:col-span-3 flex justify-center items-center bg-white rounded-lg shadow-xl max-h-screen">
          <div className="w-full max-w-md p-8">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800">
              Welcome Back! ✨
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label
                className="block text-pink-600 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                type="text"
                className={`mb-1 p-3 w-full rounded border ${
                  errors.email ? "border-red-500" : "border-pink-300"
                } focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`}
                placeholder="Enter your email..."
              ></input>
              {errors.email && (
                <p className="text-red-500 text-xs italic mb-3">
                  {errors.email.message}
                </p>
              )}

              <label
                className="block text-pink-600 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                {...register("password")}
                type="password"
                className={`mb-1 p-3 w-full rounded border ${
                  errors.password ? "border-red-500" : "border-pink-300"
                } focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200 outline-none`}
                placeholder="Enter your password"
              ></input>
              {errors.password && (
                <p className="text-red-500 text-xs italic mb-3">
                  {errors.password.message}
                </p>
              )}

              <button
                type="submit"
                className="mt-3 w-full py-3 px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200"
              >
                Sign In
              </button>
            </form>

            <div className="flex items-center justify-between mt-6">
              <hr className="w-full bg-gray-300" />
              <span className="p-2 text-gray-400 font-semibold">OR</span>
              <hr className="w-full bg-gray-300" />
            </div>

            <button className="mt-6 py-3 px-6 border border-purple-600 rounded-lg w-full flex items-center justify-center hover:bg-purple-50 transition duration-200">
              <img src={google} alt="Google" className="w-6 mr-3" />
              <span className="text-purple-600 font-semibold">
                Login with Google
              </span>
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-600">Don't have an account?</p>
              <a
                href="/register-student"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Register as Student
              </a>
              <span className="mx-2 text-gray-500">|</span>
              <a
                href="/register-tutor"
                className="text-green-600 hover:text-green-800 font-semibold"
              >
                Register as Tutor
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 hidden lg:block max-h-screen">
          <img
            src={image}
            alt="Login"
            className="h-full w-full object-cover rounded-r-lg shadow-xl"
          />
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3, // Rounded corners for the dialog
            padding: "24px", // Padding inside the dialog
            backgroundColor: "#ffffff", // Background color of the dialog
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Shadow for the dialog
          },
        }}
      >
        <DialogContent>
          <DialogContentText sx={{ color: "#673AB7", fontSize: "1.1rem" }}>
            {modalContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "#3F51B5",
              "&:hover": { backgroundColor: "#303F9F" },
              boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.15)",
              borderRadius: 20,
              fontWeight: "bold",
              textTransform: "none",
              padding: "8px 30px",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
