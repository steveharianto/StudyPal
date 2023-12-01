// Import Images
import image from "../assets/register.jpg";
import google from "../assets/google.png";

import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

// Import Firebase
import { firebase, firestore } from "../firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  username: Joi.string().required(),
  date: Joi.date().required(),
  phone: Joi.string().min(10).required(),
  password: Joi.string().min(6).required(),
  confirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

function RegisterStudent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const collectionRef = collection(firestore, "users");

      await addDoc(collectionRef, {
        name: data.name,
        username: data.username,
        email: data.email,
        dob: data.date,
        phone: data.phone,
        password: data.password,
        role: "student",
      });

      alert("Account successfully created 🥳!");
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  };

  return (
    <>
      <div
        className="grid grid-cols-5"
        style={{ width: "100vw", height: "100vh" }}
      >
        <div
          className="col-span-3 h-full mb-10"
          style={{ overflowY: "scroll" }}
        >
          <form onClick={handleSubmit(onSubmit)}>
            <div className="container ml-32 mb-10 mt-20 w-auto">
              {/* Name */}
              <h2 className="font-semibold ml-24 text-2xl font-sans">
                Create your Student Account 🧑‍🎓
              </h2>
              <div className="mt-5">
                <a>Fullname</a>
              </div>
              <input
                type="text"
                className="mt-4 h-10 w-3/4 border-2 p-3"
                placeholder="Whats your name ?"
                {...register("name")}
              ></input>
              {errors.name && (
                <p className="text-red-500 text-xs italic mb-3">
                  {errors.name.message}
                </p>
              )}

              {/* Email */}
              <div className="mt-5">
                <a>Email</a>
              </div>
              <input
                type="text"
                className="mt-4 h-10 w-3/4 border-2 p-3"
                placeholder="Your email address"
                {...register("email")}
              ></input>
              {errors.email && (
                <p className="text-red-500 text-xs italic mb-3">
                  {errors.email.message}
                </p>
              )}

              {/* Username */}
              <div className="mt-5">
                <a>Username</a>
              </div>
              <input
                type="text"
                className="mt-4 h-10 w-3/4 border-2 p-3"
                placeholder="Pick a username"
                {...register("username")}
              ></input>
              {errors.username && (
                <p className="text-red-500 text-xs italic mb-3">
                  {errors.username.message}
                </p>
              )}

              {/* DOB */}
              <div className="mt-5">
                <a>Date of Birth</a>
              </div>
              <input
                type="date"
                className="mt-4 h-10 w-3/4 border-2 p-3"
                {...register("date")}
              ></input>
              {errors.date && (
                <p className="text-red-500 text-xs italic mb-3">
                  {errors.date.message}
                </p>
              )}

              {/* Phone */}
              <div className="mt-5">
                <a>Phone number</a>
              </div>
              <input
                type="tel"
                className="mt-4 h-10 w-3/4 border-2 p-3"
                placeholder="Your phone number here.."
                {...register("phone")}
              ></input>
              {errors.phone && (
                <p className="text-red-500 text-xs italic mb-3">
                  {errors.phone.message}
                </p>
              )}

              {/* Password */}
              <div>
                <div className="mt-5">
                  <a>Password</a>
                </div>
                <input
                  type="password"
                  className="mt-4 h-10 w-4/5 border-2 p-3"
                  placeholder="Password"
                  {...register("password")}
                ></input>{" "}
                {errors.password && (
                  <p className="text-red-500 text-xs italic mb-3">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm */}
              <div>
                <div className="mt-5">
                  <a>Confirm Password</a>
                </div>
                <input
                  type="password"
                  className="mt-4 h-10 w-4/5 border-2 p-3"
                  placeholder="Password"
                  {...register("confirm")}
                ></input>{" "}
                {errors.confirm && (
                  <p className="text-red-500 text-xs italic mb-3">
                    {errors.confirm.message}
                  </p>
                )}
                <br />
              </div>

              <div style={{ clear: "both" }}></div>

              <button
                className="font-medium h-10 w-44 mt-10"
                style={{ background: "#3f5db7", color: "white" }}
                type="submit"
              >
                Create my Account
              </button>
              <br />
              <button
                style={{ borderColor: "#3f5db7" }}
                className="font-medium h-12 rounded-xl w-3/4 mt-20 border-2"
              >
                <img src={google} className="w-10 float-left ml-32" />
                <div className="mt-2 mr-36">Signup with Google</div>
              </button>
            </div>
          </form>
        </div>
        <div
          className="col-span-2 h-full"
          style={{
            overflow: "hidden",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPositionX: "50%",
          }}
        ></div>
      </div>
    </>
  );
}

export default RegisterStudent;
