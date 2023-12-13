import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import db from "../firebase";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { deepPurple, green } from "@mui/material/colors";

const ProfilePage = () => {
  const { cookies } = useOutletContext();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const userCookie = cookies.get("user");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userCookie) return;

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", userCookie.username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Extract the first document's data and ID
        const docSnapshot = querySnapshot.docs[0];
        const data = docSnapshot.data();
        const id = docSnapshot.id; // Get the document ID

        // Include the ID in your state
        const userDataWithId = { ...data, id };
        setUserData(userDataWithId);
        if (!editMode) {
          setEditData(userDataWithId);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userCookie]);

  const formatDate = (firebaseTimestamp) => {
    if (!firebaseTimestamp || !firebaseTimestamp.toDate) {
      return "";
    }
    const date = firebaseTimestamp.toDate();
    return date.toLocaleDateString();
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "users", userData.id);
    await updateDoc(userRef, editData);
    setUserData({ ...userData, ...editData });
    setEditMode(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      maxHeight="80vh"
      bgcolor={deepPurple[50]}
    >
      <Card sx={{ maxWidth: 600, width: "100%", m: 2 }}>
        {editMode ? (
          <form onSubmit={handleUpdate}>
            <CardContent>
              <TextField
                label="Full Name"
                variant="outlined"
                name="fullname"
                value={editData.fullname || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={editData.email || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                name="phoneNumber"
                value={editData.phoneNumber || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
              <Button variant="outlined" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </CardActions>
          </form>
        ) : (
          <>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={2}
              >
                <Avatar
                  src={userData.profilePicture}
                  sx={{ width: 90, height: 90, mb: 2, bgcolor: green[500] }}
                />
                <Typography variant="h5">{userData.fullname}</Typography>
                <Typography color="textSecondary">{userData.email}</Typography>
                <Typography sx={{ mt: 1 }}>
                  Phone Number: {userData.phoneNumber}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  Date Of Birth: {formatDate(userData.dob)}
                </Typography>
                <Typography sx={{ mt: 1 }}>Role: {userData.role}</Typography>
                <Typography sx={{ mt: 1 }}>
                  Username: {userData.username}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            </CardActions>
          </>
        )}
      </Card>
    </Box>
  );
};

export default ProfilePage;
