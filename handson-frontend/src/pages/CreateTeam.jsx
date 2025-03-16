import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const CreateTeamForm = () => {
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTeamData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get user token
      const response = await axios.post("/api/teams/create", teamData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
      setTeamData({ name: "", description: "", isPublic: true });
    } catch (error) {
      console.error("Error creating team:", error);
      alert(error.response?.data?.message || "Failed to create team.");
    }
  };

  return (<div className=" w-10/12 mx-auto">
          <Header/>
          <div className=" bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Create a Team</h2>
      <form onSubmit={handleSubmit}>
        {/* Team Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Team Name</label>
          <input
            type="text"
            name="name"
            value={teamData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter team name"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={teamData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter team description"
          ></textarea>
        </div>

        {/* Public/Private Toggle */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={teamData.isPublic}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Public Team</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Create Team
        </button>
      </form>
    </div>
  </div>
  );
};

export default CreateTeamForm;
