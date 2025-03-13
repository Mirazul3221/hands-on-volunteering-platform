const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, enum: ["Education", "Healthcare", "Environment", "Others"], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who created the event
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who joined
    // Storing user comments with user ID and comment text
    userComments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    type: { type: String, enum: ["event", "help_request"], required: true }, // Event or Community Help Request
    
    // New urgency field
    urgency: { type: String, enum: ["Low", "Medium", "Urgent"], default: "Medium" }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Event", EventSchema);
