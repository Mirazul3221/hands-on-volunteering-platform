import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import HelpRequestForm from "./pages/AddEvent";
import CreateTeamForm from "./pages/CreateTeam";

function App() {
  return (
    <Router>
      <Routes>
        {

        }
        <Route path="/" element={<Home />} />
        <Route path="/event/create" element={<HelpRequestForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/team/create" element={<CreateTeamForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
