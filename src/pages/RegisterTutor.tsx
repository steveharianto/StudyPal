import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import db from "../firebase";
import image from "../assets/register.jpg"; // Assuming you have a similar image for registration
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const UsersCollectionRef = collection(db, "users");

// Joi schema for form validation
const schema = Joi.object({
    fullname: Joi.string().required().messages({
        "string.empty": "Full name is required",
    }),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.empty": "Username is required",
        "string.alphanum": "Username must contain only alphanumeric characters",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username must be less than 30 characters long",
    }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Email must be a valid email address",
        }),
    phoneNumber: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.length": "Phone number must be exactly 11 digits",
            "string.pattern.base": "Phone number must contain only digits",
        }),
    dateOfBirth: Joi.date().required().messages({
        "date.base": "Date of birth is required",
        // You can add more specific validations if needed
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
    confirmPassword: Joi.any().equal(Joi.ref("password")).required().messages({
        "any.only": "Passwords do not match",
    }),
    subject: Joi.string().required().messages({
        "string.empty": "Subject is required",
    }),
    price: Joi.number().min(0).required().messages({
        "number.base": "Price is required",
        "number.min": "Price cannot be negative",
    }),
    description: Joi.string().max(10000).messages({
        "string.max": "Description must be less than 1000 characters long",
    }),
});

const RegisterTutor = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [price, setPrice] = useState(10000);
    const [selectedImage, setSelectedImage] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: joiResolver(schema),
    });

    const onSubmit = async (data) => {
        // Check if the username or email already exists
        const usernameQuery = query(UsersCollectionRef, where("username", "==", data.username));
        const emailQuery = query(UsersCollectionRef, where("email", "==", data.email));

        const usernameSnapshot = await getDocs(usernameQuery);
        const emailSnapshot = await getDocs(emailQuery);

        if (!usernameSnapshot.empty) {
            setModalContent("This username is already taken. Please choose another username.");
            setOpen(true);
            return;
        }

        if (!emailSnapshot.empty) {
            setModalContent("An account with this email already exists. Please use a different email.");
            setOpen(true);
            return;
        }

        let imageUrl = "";

        if (selectedImage) {
            const storage = getStorage();
            // Use the username as the file name for the image
            const imageRef = ref(storage, `images/${data.username}`);

            try {
                const snapshot = await uploadBytes(imageRef, selectedImage);
                imageUrl = await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.error("Error uploading image: ", error);
                setModalContent("Error uploading image. Please try again.");
                setOpen(true);
                return;
            }
        }

        // If username and email are unique, proceed with registration
        try {
            await addDoc(UsersCollectionRef, {
                // ... other data fields
                fullname: data.fullname,
                username: data.username,
                email: data.email,
                phoneNumber: data.phoneNumber,
                dob: data.dateOfBirth,
                role: "tutor",
                subject: data.subject,
                price: data.price,
                description: data.description,
                password: data.password, // Consider storing only a hash of the password
                imageUrl: imageUrl, // Store the image URL with the username
                schedule: [],
                balance: 0,
            });
            console.log("User registered successfully");
            navigate("/login");
        } catch (error) {
            console.error("Error adding document: ", error);
            setModalContent("An error occurred during registration. Please try again.");
            setOpen(true);
        }
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleClose = () => {
        setOpen(false);
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
            if (userCookie.role == "student") {
                navigate("/dashboard-student");
            } else if (userCookie.role == "tutor") {
                navigate("/dashboard-tutor");
            }
        }
    }, [navigate]);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-5 w-full h-screen">
                <div className="lg:col-span-3 flex justify-center items-center overflow-y-auto">
                    <div className="w-full max-w-lg p-4 lg:p-8 bg-white rounded-lg" style={{ maxHeight: "100vh" }}>
                        <h2 className="text-3xl font-bold mb-6 text-green-800">Tutor Registration</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-wrap gap-x-6">
                                <div style={{ width: "47%" }}>
                                    {/* Full Name */}
                                    <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="fullname">
                                        Full Name
                                    </label>
                                    <input id="fullname" {...register("fullname")} type="text" className="mb-1 p-3 w-full rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none" placeholder="Enter your full name..."></input>
                                    {errors.fullname && <p className="text-red-500 text-xs italic mb-3">{errors.fullname.message}</p>}
                                </div>
                                <div style={{ width: "47%" }}>
                                    {/* Username */}
                                    <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="username">
                                        Username
                                    </label>
                                    <input id="username" {...register("username")} type="text" className="mb-1 p-3 w-full rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none" placeholder="Enter your username..."></input>
                                    {errors.username && <p className="text-red-500 text-xs italic mb-3">{errors.username.message}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="email">
                                Email
                            </label>
                            <input id="email" {...register("email")} type="email" className="mb-1 p-3 w-full rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none" placeholder="Enter your email..."></input>
                            {errors.email && <p className="text-red-500 text-xs italic mb-3">{errors.email.message}</p>}

                            <div className="flex flex-wrap gap-x-6">
                                <div style={{ width: "47%" }}>
                                    {/* Phone Number */}
                                    <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="phoneNumber">
                                        Phone Number
                                    </label>
                                    <input id="phoneNumber" {...register("phoneNumber")} type="tel" className="mb-1 p-3 w-full rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none" placeholder="Enter your phone number..."></input>
                                    {errors.phoneNumber && <p className="text-red-500 text-xs italic mb-3">{errors.phoneNumber.message}</p>}
                                </div>
                                <div style={{ width: "47%" }}>
                                    {/* Date of Birth */}
                                    <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="dateOfBirth">
                                        Date of Birth
                                    </label>
                                    <input id="dateOfBirth" {...register("dateOfBirth")} type="date" className="mb-1 p-3 w-full rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none" placeholder="Enter your date of birth"></input>
                                    {errors.dateOfBirth && <p className="text-red-500 text-xs italic mb-3">{errors.dateOfBirth.message}</p>}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-x-6">
                                <div style={{ width: "47%" }}>
                                    {/* Password */}
                                    <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input id="password" {...register("password")} type="password" className="mb-1 p-3 w-full rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none" placeholder="Enter your password"></input>
                                    {errors.password && <p className="text-red-500 text-xs italic mb-3">{errors.password.message}</p>}
                                </div>
                                <div style={{ width: "47%" }}>
                                    {/* Confirm Password */}
                                    <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <input id="confirmPassword" {...register("confirmPassword")} type="password" className="mb-1 p-3 w-full rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none" placeholder="Confirm your password"></input>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs italic mb-3">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            {/* Subject */}
                            <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="subject">
                                Subject
                            </label>
                            <select id="subject" {...register("subject")} className="mb-1 p-3 w-full rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none">
                                <option value="English">English</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Communication">Communication</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                            </select>
                            {errors.subject && <p className="text-red-500 text-xs italic mb-5">{errors.subject.message}</p>}

                            {/* Price */}
                            <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="price">
                                Price: {formatRupiah(price)}
                            </label>
                            <input id="price" {...register("price")} type="range" min="10000" max="200000" step="1000" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-1 w-full" />
                            {errors.price && <p className="text-red-500 text-xs italic mb-5">{errors.price.message}</p>}

                            {/* Description */}
                            <label className="block text-green-600 text-sm font-medium mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea id="description" {...register("description")} className="mb-1 p-3 w-full h-32 rounded border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200 outline-none" placeholder="Enter a description..."></textarea>
                            {errors.description && <p className="text-red-500 text-xs italic mb-3">{errors.description.message}</p>}

                            {/* Image Upload */}
                            <label className="block text-green-600 text-sm font-medium mb-2">Profile Picture</label>
                            <input type="file" onChange={handleImageChange} className="mb-3 w-full border border-green-300" />
                            {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="mb-3 w-20 h-20 object-cover" />}

                            <button type="submit" className="mt-3 w-full py-3 px-6 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-200">
                                Register
                            </button>
                            <div className="mt-8 text-center">
                                <p className="text-gray-600">Already have an account?</p>
                                <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                                    Go to Login Page
                                </a>
                            </div>
                            <div className="mt-5 invisible">a</div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 hidden lg:block" style={{ width: "100%", height: "100vh" }}>
                    <img src={image} alt="Register" className="h-full w-full object-cover rounded-r-lg shadow-xl" />
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
                    <DialogContentText sx={{ color: "#673AB7", fontSize: "1.1rem" }}>{modalContent}</DialogContentText>
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

export default RegisterTutor;
