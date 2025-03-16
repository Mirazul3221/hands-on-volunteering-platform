import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ProtectRoute from "../components/ProtectRoute";
import Header from "../components/Header";
import { apiUrl } from "../config";
import EventContainer from "./CommentsWindow";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [events, setEvents] = useState();
  const [eventStatus, setEventStatus] = useState("events");
  const [userData, setUser] = useState({
    name: "",
    bio: "",
    skills: [],
    causes: [],
    profilePicture: "",
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...userData, profilePicture: file });
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user data on mount
    axios
      .get(`${apiUrl}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
        },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [token]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/events/findmyevent`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
        },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  const handleChange = (e) => {
    setUser({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("bio", userData.bio);
      formData.append("skills", userData.skills.join(","));
      formData.append("causes", userData.causes.join(","));
      if (userData.profilePicture) {
        formData.append("profilePicture", userData.profilePicture); // Append file
      }
      const res = await axios.put(`${apiUrl}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert(res.data.message);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const [openWindow, setOpenWindow] = useState(false);
  const poenEditContainer = () => {
    setOpenWindow(true);
  };

  // console.log(user?.volunteerHistory[0].eventId);
  return (
     <ProtectRoute>
         <div>
          <div className="px-4">
          <Header/>
          </div>
      <div className="relative h-fit -z-10 mt-4">
        <img className="w-fit" src="/background-3.jpg" alt="gh" />
      </div>
      <div className="md:flex">
        <div className="bio md:w-1/2 md:rounded-tr-[350px] shadow-md px-10 -mt-20 pb-20 z-10 md:bg-gray-50">
          <div className="w-2/3 mx-auto">
            <div className="w-48 mx-auto relative">
              <img
                className="md:w-48 md:h-48 rounded-full bg-white border-4 border-gray-100"
                src={userData?.profilePicture}
                alt="gh"
              />
              <div
                onClick={poenEditContainer}
                className="edit absolute bottom-0 right-5 px-2 py-1 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-400 duration-300"
              >
                Edit
              </div>
            </div>
            <h2 className="md:text-5xl text-2xl text-center">{userData?.name}</h2>
          </div>
          <div className="desc mt-4">
            <p>
              {userData?.bio !== ""
                ? userData?.bio
                : "No data found . Please Add your biodata"}
            </p>
            <div className="flex justify-between mt-4">
              {userData?.skills?.length === 0 && <h3>skills : Empty</h3>}
              {userData?.skills?.length !== 0 && (
                <div className="flex gap-2">
                  {userData?.skills.map((skl) => {
                    return (
                      <h2 className="py-1 px-6 bg-gray-50 rounded-md shadow-sm">
                        {skl}
                      </h2>
                    );
                  })}
                </div>
              )}
              {userData?.causes?.length === 0 && <h3>Causes : Empty</h3>}
              {userData?.causes?.length !== 0 && (
                <div className="flex gap-2">
                  {userData?.causes.map((skl) => {
                    return (
                      <h2 className="py-1 px-6 bg-gray-50 rounded-md shadow-sm">
                        {skl}
                      </h2>
                    );
                  })}
                </div>
              )}
            </div>

            <h2 className="bg-gray-50 w-full border text-2xl text-center px-6 py-1 rounded-md mt-10">
              Event joined by you
            </h2>

            <div>
              {userData?.volunteerHistory?.map((event) => {
                return (
                  <EventContainer event={event?.eventId} user={user}/>
                );
              })}
            </div>
          </div>
        </div>
        <div className="md:w-1/2 px-10">
          <div className="flex justify-between mt-4">
            <h2
              className={`bg-gray-50 w-full border text-2xl text-center px-6 py-1 rounded-md`}
            >
              Events added by you
            </h2>
          </div>

          {eventStatus === "events" && (
            <div>
              {events && events?.map((event) => (
                        <EventContainer event={event} user={user}/>
              ))}
            </div>
          )}

          {
            events?.length === 0 && <h2 className="mt-4 text-center">Data not found</h2>
          }
        </div>
      </div>
      <div
        className={`${
          openWindow
            ? "fixed top-0 left-0 flex z-50 justify-center items-center w-screen h-screen bg-gray-300"
            : "hidden"
        } mx-auto p-6 rounded-lg shadow-md`}
      >
        <div className="md:w-1/2 bg-white relative p-6 shadow-lg rounded-md">
          <h3
            onClick={() => {
              setOpenWindow(false);
            }}
            className="absolute top-4 right-4 cursor-pointer"
          >
            Close
          </h3>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="skills"
              value={userData.skills.join(",")}
              onChange={(e) =>
                setUser({ ...userData, skills: e.target.value.split(",") })
              }
              placeholder="Skills (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="causes"
              value={userData.causes.join(",")}
              onChange={(e) =>
                setUser({ ...userData, causes: e.target.value.split(",") })
              }
              placeholder="Causes (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-semibold rounded-lg transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
     </ProtectRoute>
  );
};

export default Profile;
