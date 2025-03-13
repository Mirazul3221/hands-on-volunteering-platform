const Event = require("../models/Event");
const User = require("../models/User");

exports.create = async (req, res) => {
    try {
            const createdBy = req.user.id
            const allData = req.body;
            const schema = {createdBy,...allData}
      const newEvent = new Event(schema);
      console.log(req.body)
      await newEvent.save();
      res.status(200).json({ success: true, message: "Event created successfully!", event: newEvent });
    } catch (error) {
      res.status(500).json({ success: false, message: "Event creation failed", error });
    }
  }

  exports.find = async (req, res) => {
    try {
      const events = await Event.find()
        .populate("createdBy", "name profilePicture _id") // Get event creator details
        .populate("attendees", "name profilePicture skills") // Get attendees' details
        .populate({path:"userComments.user", select:'name profilePicture'});
        
      res.status(200).json(events.reverse());
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch all events", error });
    }
  };
  
  exports.myEvent = async (req, res) => {
    const createdBy = req.user.id
    try {
      const events = await Event.find({createdBy:createdBy})
        .populate("createdBy", "name _id") // Get event creator details
        .populate("attendees", "name email skills"); // Get attendees' details
  
      res.status(200).json(events.reverse());
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch all events", error });
    }
  };
  

  exports.filterEvents = async (req, res) => {
    try {
      const { category, location } = req.query;
      const filters = {};
  
      if (category) filters.category = category;
      if (location) filters.location = location;
  
      const events = await Event.find(filters)
      .populate("createdBy", "name profilePicture _id") // Get event creator details
      .populate("attendees", "name profilePicture skills") // Get attendees' details
      .populate({path:"userComments.user", select:'name profilePicture'});
  
      res.json(events);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to filter events", error });
    }
  };
  
  exports.join = async (req, res) => {
    try {
        const userId = req.user?.id;
        const eventId = req.params.eventId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Check if the user has already joined
        if (event.attendees.includes(userId)) {
            return res.json({ success: true, message: "Already joined!", event });
        }

        // Add user to event attendees
        event.attendees.push(userId);
        await event.save();

        // Fetch user BEFORE updating
        const userBeforeUpdate = await User.findById(userId);
        console.log("User before update:", userBeforeUpdate);

        // Add event to user's volunteer history
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    volunteerHistory: {
                        eventId: eventId,
                        hoursContributed: 0,
                        date: new Date(),
                    },
                },
            },
            { new: true }
        );

        console.log("User after update:", updatedUser);

        res.json({
            success: true,
            message: "You joined the event!",
        });

    } catch (error) {
        console.error("Error joining event:", error);
        res.status(500).json({ success: false, message: "Error joining event", error });
    }
};

exports.createComment = async(req,res) => {
  try {
    const userId = req.user?.id;
    const eventId = req.body.eventId;
    const comment = req.body.comment;
    const user = await User.findById(userId)
    console.log(user.profilePicture)
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
    }
    event.userComments.push({user:userId,comment})
    await event.save();
    res.json({name:user.name,comment,profile:user.profilePicture,time:new Date().toISOString()})
  } catch (error) {
    console.error("Error in comments:", error);
    res.status(500).json({ success: false, message: "Error in comments", error });
  }
}