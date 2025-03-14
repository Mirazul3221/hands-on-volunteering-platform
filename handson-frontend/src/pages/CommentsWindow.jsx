import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import axios from "axios";
const EventContainer = ({ event, user }) => {
  const [commentWindow, setCommentWindow] = useState(false);
  const tokenRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    tokenRef.current = token;
  }, []);
  const handleJoinButton = async () => {
    try {
      const { data } = await axios.post(
        `https://handson-backend-sigma.vercel.app/api/events/join/${event._id}`,
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
  const [attendees, setAttendees] = useState(null);
  const [comments, setComments] = useState([]);
  const handleAttendees = (e) => {
    setAttendees(e);
  };

  const [comment, setComment] = useState("");
  const handleCommentSubmit = async () => {
    try {
      const { data } = await axios.post(
        `https://handson-backend-sigma.vercel.app/api/events/comment/`,
        { comment, eventId: event._id },
        {
          headers: {
            Authorization: `Bearer ${tokenRef.current}`, // Include JWT token in Authorization header
          },
        }
      );
      setComment('')
     console.log(data)
     setComments(prev=>[data,...prev])
    } catch (error) {}
  };

  useEffect(() => {
    event.userComments.map((u) => {
      //    console.log(u)
      const name = u.user.name;
      const profile = u.user.profilePicture;
      const singleComment = {
        name,
        profile,
        comment: u.comment,
        time: u.createdAt,
      };
      setComments((prev) => [singleComment,...prev]);
    });
  }, []);

  console.log(comments);
  return (
    <div>
      <div
        key={event._id}
        className={`border border-gray-300 mt-1 rounded-2xl p-4 mb-2 shadow-md ${
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
            <img
              className="w-10 h-10 rounded-full"
              src={event?.createdBy?.profilePicture}
              alt="sdgd"
            />
          </div>
          <div className="">
            <p>
              {user?._id == event?.createdBy?._id
                ? "You"
                : event?.createdBy?.name}
            </p>
            <p className="text-sm">{dateFormate(event?.createdAt)}</p>
          </div>
        </div>
        <h3 className="text-xl">{event?.title}</h3>
        <p>{event.description}</p>
        <p>
          <strong>Date:</strong> {event?.createdAt}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
  <h2 className="hover:bg-gray-200 flex-shrink font-semibold text-gray-700 duration-300 bg-white px-4 py-1 rounded-md border border-gray-300">
    Category: <span className="font-thin">{event?.category}</span>
  </h2>
  <h2 className="hover:bg-gray-200 font-semibold text-gray-700 duration-300 bg-white px-4 py-1 rounded-md border border-gray-300">
    Location: <span className="font-thin">{event?.location}</span>
  </h2>
  <h2
    className={`${
      event.urgency === "Urgent"
        ? "bg-rose-200"
        : event.urgency === "Medium"
        ? "bg-yellow-200"
        : "bg-green-200"
    } font-semibold text-gray-700 duration-300 px-4 py-1 rounded-md border border-gray-300`}
  >
    {event.urgency}
  </h2>
  <h2
    onClick={() => handleAttendees(event.attendees)}
    title="Click here to see the total attendees"
    className="hover:bg-gray-200 duration-300 bg-white px-4 py-1 cursor-pointer rounded-md border border-gray-300"
  >
    Total joined: {event.attendees.length}
  </h2>
  <button
    onClick={() => handleJoinButton()}
    className="hover:bg-gray-200 duration-300 bg-white px-4 py-1 cursor-pointer rounded-md border border-gray-300"
  >
    Join Now
  </button>
  {event?.userComments.length === 0 && (
    <button 
      onClick={() => setCommentWindow(!commentWindow)}
      className="hover:bg-gray-200 duration-300 bg-white px-4 py-1 cursor-pointer rounded-md border border-gray-300"
    >
      Leave a comment
    </button>
  )}
</div>

        {commentWindow && (
          <div className="flex mt-4 gap-4">
            <input value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full py-1 px-4 border border-gray-300 rounded-md outline-none"
              type="text"
            />
            <div
              onClick={handleCommentSubmit}
              className="hover:bg-gray-200 duration-300 bg-white w-fit px-4 py-1 cursor-pointer rounded-md border border-gray-300"
            >
              Submit
            </div>
          </div>
        )}

        {comments.length !== 0 && (
          <div className="mt-4 space-y-1">
            {
               comments?.map(c=>{
                return <div className="bg-white py-2 px-6 w-fit rounded-lg">
                            <div className="top flex items-center gap-2">
          <div className="">
            <img
              className="w-8 h-8 rounded-full"
              src={c.profile}
              alt="sdgd"
            />
          </div>
          <div className="">
            <p className="text-sm">
              {c.name}
            </p>
           <div className="flex gap-2 text-sm">
           <p>{c.comment}</p> ||   <p className="w-28">{dateFormate(c?.createdAt)}</p> 
           </div>
          </div>
        </div>
                </div>
               }) 
            }
                <div className="mt-4">
                <p>Leave a comment</p>
            <div className="flex gap-4">
              <input  value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full py-1 px-4 border border-gray-300 rounded-md outline-none"
                type="text"
              />
              <div
                onClick={handleCommentSubmit}
                className="hover:bg-gray-200 duration-300 bg-white w-fit px-4 py-1 cursor-pointer rounded-md border border-gray-300"
              >
                Submit
              </div>
            </div>
                </div>
          </div>
        )}
      </div>
      {attendees?.length > 0 && (
        <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-2xl bg-white p-6 border">
          {attendees?.map((u) => {
            return (
              <div className="telative">
                <div
                  onClick={() => setAttendees(null)}
                  className="absolute top-2 right-2 cursor-pointer"
                >
                  Close
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={u?.profilePicture}
                    alt="sdgd"
                  />
                  <p>{u.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventContainer;
