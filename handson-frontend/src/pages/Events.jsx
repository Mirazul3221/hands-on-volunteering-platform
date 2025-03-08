import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const tokenRef = useRef(null)
  useEffect(() => {
   const token = localStorage.getItem('token')
   tokenRef.current = token
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/api/events/find")
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleJoinButton = async (id)=> {
    try {
      const {data} = await axios.post(`http://localhost:5000/api/events/join/${id}`, '',{
        headers: {
          Authorization: `Bearer ${ tokenRef.current}`, // Include JWT token in Authorization header
        },
      });
      alert(data.message)
    } catch (error) {
      
    }
  }//

  return (
    <div className="px-20 mt-10">
      <h2 className="text-2xl mb-4">Upcoming Events</h2>
      {events.map((event) => (
        <div key={event._id} className="border border-gray-300 mt-4 rounded-2xl p-4 mb-2 shadow-md bg-gray-100">
          <h3 className="text-xl">{event.title}</h3>
          <p>{event.description}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <button onClick={()=>{handleJoinButton(event._id)}} className="mt-4 hover:bg-gray-200 duration-300 bg-white w-fit px-4 py-1 cursor-pointer rounded-md border border-gray-300">Join Now</button>
        </div>
      ))}
    </div>
  );
};

export default Events;
