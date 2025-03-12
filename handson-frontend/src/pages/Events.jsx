import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";

const Events = () => {
   const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const tokenRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    tokenRef.current = token;
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events/find",        {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`, // Include JWT token in Authorization header
        },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleJoinButton = async (id) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/events/join/${id}`,
        "",
        {
          headers: {
            Authorization: `Bearer ${tokenRef.current}`, // Include JWT token in Authorization header
          },
        }
      );
      alert(data.message);
    } catch (error) {}
  }; //

    const dateFormate = (createdAt) => {
      const currentYear = moment().year();
      const postYear = moment(createdAt).year();
      const format =
        currentYear === postYear ? "D MMM h:mm A" : "D MMMM h:mm A YYYY";
      const formattedDate = moment(createdAt).format(format);
      return formattedDate;
    };
  return (
    <div className="px-20 mt-10">
      <Logo/>
      <div className="flex gap-4 items-center">
        <div className="flex w-full justify-between items-center">
        <h2 className="text-2xl">New Events</h2>
      <div className="flex items-center gap-4">
      <a className="text-2xl hover:underline" href="./event/create">
          Post a Event
        </a>  
        <h3 className="font-semibold text-2xl rounded-md bg-gray-200 py-1 px-6 text-gray-700">{user?.name}</h3>
      </div>
        </div>
      </div>
      {events.map((event) => (
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
                      <div className="top flex items-center gap-2">
                        <div className="">
                          <img src={''} alt="" />

                        </div>
                        <div className="">
                          <h2 className="font-semibold text-md">{event?.createdBy?.name}</h2>
                          {/* <p className="text-sm">{dateFormate(event?.createdAt)}</p> */}
                        </div>
                      </div>
          <p>Created by {user?._id == event?.createdBy?._id ? "you" : event?.createdBy?.name}</p>
          <h3 className="text-xl">{event?.title}</h3>
          <p>{event.description}</p>
          <p>
            <strong>Date:</strong> {event?.createdAt}
          </p>
          <div className="flex gap-2 items-center">
            <h2 className="hover:bg-gray-200 font-semibold text-gray-700 duration-300 bg-white w-fit px-4 py-1 rounded-md border border-gray-300">
              category : <span className="font-thin">{event?.category}</span>
            </h2>
            <h2 className="hover:bg-gray-200 font-semibold text-gray-700 duration-300 bg-white w-fit px-4 py-1 rounded-md border border-gray-300">
              Location : <span className="font-thin">{event?.location}</span>
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
            <h2
              className="hover:bg-gray-200 duration-300 bg-white w-fit px-4 py-1 cursor-pointer rounded-md border border-gray-300"
            >
              Total joined : {event.attendees.length}
            </h2>
            <button
              onClick={() => {
                handleJoinButton(event._id);
              }}
              className="hover:bg-gray-200 duration-300 bg-white w-fit px-4 py-1 cursor-pointer rounded-md border border-gray-300"
            >
              Join Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;
