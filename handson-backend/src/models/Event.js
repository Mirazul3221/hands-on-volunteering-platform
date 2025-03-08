const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, enum: ["Education", "Healthcare", "Environment", "Others"], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who created the event
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who joined
  type: { type: String, enum: ["event", "help_request"], required: true }, // Event or Community Help Request
  
  // New urgency field
  urgency: { type: String, enum: ["Low", "Medium", "Urgent"], default: "Medium" },
});

module.exports = mongoose.model("Event", EventSchema);//