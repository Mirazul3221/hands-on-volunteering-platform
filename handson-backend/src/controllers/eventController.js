const Event = require("../models/Event");

exports.create = async (req, res) => {
    try {
      const newEvent = new Event(req.body);
      console.log(req.body)
      await newEvent.save();
      res.status(200).json({ success: true, message: "Event created successfully!", event: newEvent });
    } catch (error) {
      res.status(500).json({ success: false, message: "Event creation failed", error });
    }
  }

  exports.find = async (req, res) => {
    try {
        const { category, location } = req.query;
        const filters = {};
    
        if (category) filters.category = category;
        if (location) filters.location = 'Dhaka';
    
        const events = (await Event.find(filters).populate("createdBy", "name")).reverse();
        res.json(events);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch events", error });
      }
  }
  exports.join = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)
        const event = await Event.findById(req.params.eventId);
    
        if (!event) return res.status(404).json({ message: "Event not found" });
    
        if (!event.attendees.includes(userId)) {
          event.attendees.push(userId);
          await event.save();
          res.json({ success: true, message: "You joined the event!", event });
        } else {
          res.json({ success: true, message: "Already joined!", event });
        }
    
       
      } catch (error) {
        res.status(500).json({ message: "Error joining event", error });
      }
  }