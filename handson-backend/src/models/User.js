const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" }, // Short bio
    skills: [{ type: String }], // List of skills (e.g., "Teaching", "First Aid")
    causes: [{ type: String, enum: ["Environmental", "Education", "Healthcare", "Others"] }], // Supported causes
    profilePicture: { type: String, default: "https://res.cloudinary.com/dqwino0wb/image/upload/v1724909787/Screenshot_3_qrv36z.png" }, // Cloudinary URL for profile picture
    volunteerHistory: [
      {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // Events user attended
        hoursContributed: Number, // Hours volunteered
        date: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);

