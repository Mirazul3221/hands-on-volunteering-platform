import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [events, setEvents] = useState();
  const [eventStatus, setEventStatus] = useState("events");
  const [user, setUser] = useState({
    name: "",
    bio: "",
    skills: [],
    causes: [],
    profilePicture: "",
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, profilePicture: file });
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user data on mount
    axios
      .get("http://localhost:5000/api/auth/user", {
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
      .get("http://localhost:5000/api/events/findmyevent", {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
        },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("bio", user.bio);
      formData.append("skills", user.skills.join(","));
      formData.append("causes", user.causes.join(","));
      if (user.profilePicture) {
        formData.append("profilePicture", user.profilePicture); // Append file
      }
      const res = await axios.put("http://localhost:5000/api/auth/profile", formData, {
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
    <div className="">
      <Logo />

      <div className="relative h-fit -z-10 mt-4">
        <img className="w-fit" src="/background-3.jpg" alt="gh" />
      </div>
      <div className="flex">
        <div className="bio w-1/2 rounded-tr-[350px] shadow-md px-10 -mt-20 pb-20 z-10 bg-gray-50">
          <div className="w-2/3 mx-auto">
            <div className="w-48 mx-auto relative">
              <img
                className="w-48 h-48 rounded-full bg-white border-4 border-gray-100"
                src={user?.profilePicture}
                alt="gh"
              />
              <div
                onClick={poenEditContainer}
                className="edit absolute bottom-0 right-5 px-2 py-1 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-400 duration-300"
              >
                Edit
              </div>
            </div>
            <h2 className="text-5xl text-center">{user?.name}</h2>
          </div>
          <div className="desc mt-4">
            <p>
              {user?.bio !== ""
                ? user?.bio
                : "No data found . Please Add your biodata"}
            </p>
            <div className="flex justify-between mt-4">
              {user?.skills?.length === 0 && <h3>skills : Empty</h3>}
              {user?.skills?.length !== 0 && (
                <div className="flex gap-2">
                  {user?.skills.map((skl) => {
                    return (
                      <h2 className="py-1 px-6 bg-gray-50 rounded-md shadow-sm">
                        {skl}
                      </h2>
                    );
                  })}
                </div>
              )}
              {user?.causes?.length === 0 && <h3>Causes : Empty</h3>}
              {user?.causes?.length !== 0 && (
                <div className="flex gap-2">
                  {user?.causes.map((skl) => {
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
              {user?.volunteerHistory?.map((event) => {
                return (
                  <div
                    key={event?.eventId._id}
                    className={`border border-gray-300 mt-4 rounded-2xl p-4 mb-2 shadow-md ${
                      event.eventId?.urgency === "Urgent"
                        ? "bg-rose-50"
                        : event.eventId?.urgency === "Medium"
                        ? "bg-yellow-50"
                        : "bg-green-50"
                    } `}
                  >
                    <h2 className="font-semibold text-2xl mb-2 underline text-gray-700">
                      {event?.eventId?.type}
                    </h2>
                    <h3 className="text-xl">{event?.title}</h3>
                    <p>{event?.eventId?.description}</p>
                    <p>
                      Created by{" "}
                      {user?._id == event.eventId?.createdBy?._id
                        ? "you"
                        : event?.eventId?.createdBy?.name}
                    </p>
                    <p>
                      <strong>Date:</strong> {event?.eventId?.createdAt}
                    </p>
                    <div className="flex gap-2 items-center">
                      <h2 className="hover:bg-gray-200 font-semibold text-gray-700 duration-300 bg-white w-fit px-4 py-1 rounded-md border border-gray-300">
                        <span className="font-thin">
                          {event?.eventId.category}
                        </span>
                      </h2>
                      <h2 className="hover:bg-gray-200 font-semibold text-gray-700 duration-300 bg-white w-fit px-4 py-1 rounded-md border border-gray-300">
                        <span className="font-thin">
                          {event?.eventId?.location}
                        </span>
                      </h2>
                      <h2
                        className={`${
                          event?.eventId?.urgency === "Urgent"
                            ? "bg-rose-200"
                            : event?.eventId?.urgency === "Medium"
                            ? "bg-yellow-200"
                            : "bg-green-200"
                        } font-semibold text-gray-700 duration-300 w-fit px-4 py-1 rounded-md border border-gray-300`}
                      >
                        {event.eventId?.urgency}
                      </h2>
                      <h2 className="hover:bg-gray-200 duration-300 bg-white w-fit px-4 py-1 cursor-pointer rounded-md border border-gray-300">
                        Total joined : {event?.eventId?.attendees?.length}
                      </h2>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-1/2 px-10">
          <div className="flex justify-between mt-4">
            <h2
              className={`bg-gray-50 w-full border text-2xl text-center px-6 py-1 rounded-md`}
            >
              Events added by you
            </h2>
          </div>

          {eventStatus === "events" && (
            <div>
              {events?.map((event) => (
                <div
                  key={event._id}
                  className={`border border-gray-300 mt-4 rounded-2xl p-4 mb-2 shadow-md ${
                    event.urgency === "Urgent"
                      ? "bg-rose-50"
                      : event.urgency === "Medium"
                      ? "bg-yellow-50"
                      : "bg-green-50"
                  } `}
                >
                  <h2 className="font-semibold text-2xl mb-2 underline text-gray-700">
                    {event?.type}
                  </h2>
                  <h3 className="text-xl">{event?.title}</h3>
                  <p>{event.description}</p>
                  <p>
                    Created by{" "}
                    {user?._id == event?.createdBy?._id
                      ? "you"
                      : event?.createdBy?.name}
                  </p>
                  <p>
                    <strong>Date:</strong> {event?.createdAt}
                  </p>
                  <div className="flex gap-2 items-center">
                    <h2 className="hover:bg-gray-200 font-semibold text-gray-700 duration-300 bg-white w-fit px-4 py-1 rounded-md border border-gray-300">
                      <span className="font-thin">{event?.category}</span>
                    </h2>
                    <h2 className="hover:bg-gray-200 font-semibold text-gray-700 duration-300 bg-white w-fit px-4 py-1 rounded-md border border-gray-300">
                      <span className="font-thin">{event?.location}</span>
                    </h2>
                    <h2
                      className={`${
                        event.urgency === "Urgent"
                          ? "bg-rose-200"
                          : event.urgency === "Medium"
                          ? "bg-yellow-200"
                          : "bg-green-200"
                      } font-semibold text-gray-700 duration-300 w-fit px-4 py-1 rounded-md border border-gray-300`}
                    >
                      {event.urgency}
                    </h2>
                    <h2 className="hover:bg-gray-200 duration-300 bg-white w-fit px-4 py-1 cursor-pointer rounded-md border border-gray-300">
                      Total joined : {event.attendees.length}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`${
          openWindow
            ? "fixed top-0 left-0 flex z-50 justify-center items-center w-screen h-screen bg-gray-300"
            : "hidden"
        } mx-auto p-6 rounded-lg shadow-md`}
      >
        <div className="w-1/2 bg-white relative p-6 shadow-lg rounded-md">
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
              value={user.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="skills"
              value={user.skills.join(",")}
              onChange={(e) =>
                setUser({ ...user, skills: e.target.value.split(",") })
              }
              placeholder="Skills (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="causes"
              value={user.causes.join(",")}
              onChange={(e) =>
                setUser({ ...user, causes: e.target.value.split(",") })
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
      <Footer />
    </div>
  );
};

export default Profile;
