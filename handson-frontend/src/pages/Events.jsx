import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import EventContainer from "./CommentsWindow";
import Header from "../components/Header";
import ProtectRoute from "../components/ProtectRoute";

const Events = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const locations = useRef([]);
  const categories = useRef([]);
  const tokenRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    tokenRef.current = token;
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events/find", {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`, // Include JWT token in Authorization header
        },
      })
      .then((res) => {
        setEvents(res.data);
        res.data?.map((e) => {
          if (!locations.current.includes(e.location)) {
            locations.current.push(e.location);
            console.log(e.location);
          }
        });
        res.data?.map((e) => {
          if (!categories.current.includes(e.category)) {
            categories.current.push(e.category);
          }
        });
      })
      .catch((err) => console.log(err));
  }, [locations]);

  useEffect(() => {
    const filterData = async () => {
      await axios
        .get(
          `http://localhost:5000/api/events/filter?category=${category}&location=${location}`,
          {
            headers: {
              Authorization: `Bearer ${tokenRef.current}`, // Include JWT token in Authorization header
            },
          }
        )
        .then((res) => setEvents(res.data))
        .catch((err) => console.log(err));
    };
    if (location == "" && category == "") return;
    filterData();
  }, [location, category]);
  return (
    <ProtectRoute>
      <div className="md:px-20 px-2">
        <Header />
        <div className="md:flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <a className="md:text-2xl  border duration-150 px-6 py-1 rounded-md shadow-sm" href="./event/create">
                  Post a Event
                </a>
                <a className="md:text-2xl  border duration-150 px-6 py-1 rounded-md shadow-sm"  href="./event/create">
                  Create a team
                </a>
              </div>

              {(locations || categories) && (
                <div className="md:flex gap-4 border rounded-md py-2 px-2 mt-2 md:mt-0 md:px-6">
                  filtered by :{" "}
                  <select
                    onChange={(e) => {
                      setLocation(e.target.value);
                    }}
                  >
                    <option defaultChecked value="">
                      location
                    </option>
                    {locations.current &&
                      locations.current.map((l) => {
                        return <option value={l}>{l}</option>;
                      })}
                  </select>{" "}
                  <select
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    <option defaultChecked value="">
                      category
                    </option>
                    {categories.current &&
                      categories.current.map((c) => {
                        return <option value={c}>{c}</option>;
                      })}
                  </select>
                </div>
              )}
            </div>
        <h2 className="mt-4 text-lg">New Arrival</h2>
        {events.map((event) => (
          <EventContainer event={event} user={user} />
        ))}
      </div>
    </ProtectRoute>
  );
};

export default Events;
