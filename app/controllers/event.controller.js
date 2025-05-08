import Event from "../sequelizeUtils/event.js";

const exports = {};

exports.create = async (req, res) => {
  await Event.createEvent(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the event.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Event.findOneEvent(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find event with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving event with id = " + req.params.id,
      });
      console.log("Could not find event: " + err);
    });
};

exports.findByToken = async (req, res) => {
  await Event.findEventByToken(req.params.eventToken)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find event with token = ${req.params.eventToken}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving event with token = " + req.params.eventToken,
      });
      console.log("Could not find event: " + err);
    });
};

exports.findAll = async (req, res) => {
  const {
    page,
    pageSize,
    searchQuery,
    startDate,
    endDate,
    location,
    strengths,
    sortAttribute,
    sortDirection,
  } = req.query;
  await Event.findAllEvents(page, pageSize, searchQuery, {
    startDate,
    endDate,
    location,
    strengths,
    sortAttribute,
    sortDirection,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

exports.update = async (req, res) => {
  await Event.updateEvent(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Event was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update event with id = ${req.params.id}. Maybe event was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating event with id = " + req.params.id,
      });
      console.log("Could not update event: " + err);
    });
};

exports.delete = async (req, res) => {
  await Event.deleteEvent(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Event was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete event with id = ${req.params.id}. Maybe event was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete event with id = " + req.params.id,
      });
      console.log("Could not delete event: " + err);
    });
};

exports.getRegistrationTypes = (req, res) => {
  res.send(Event.getRegistrationTypes());
};

exports.getAttendanceTypes = (req, res) => {
  res.send(Event.getAttendanceTypes());
};

exports.getCompletionTypes = (req, res) => {
  res.send(Event.getCompletionTypes());
};

exports.registerStudents = async (req, res) => {
  const eventId = req.params.id;
  const { studentIds } = req.body;
  console.log(eventId);
  console.log(studentIds);
  try {
    const data = await Event.registerStudents(eventId, studentIds);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while registering students.",
    });
  }
};

exports.unregisterStudents = async (req, res) => {
  const eventId = req.params.id;
  const { studentIds } = req.body;

  if (!eventId || !Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).send({
      message: "Invalid eventId or studentIds.",
    });
  }

  try {
    const result = await Event.unregisterStudents(eventId, studentIds);
    res.send({
      message: "Successfully unregistered students from event.",
      result,
    });
  } catch (err) {
    console.error("Error unregistering students:", err);
    res.status(500).send({
      message: err.message || "Failed to unregister students.",
    });
  }
};

exports.getRegisteredEventsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const events = await Event.getRegisteredEventsForStudent(studentId);
    res.send(events);
  } catch (err) {
    console.error("Error fetching registered events for student:", err);
    res.status(500).send({ message: "Failed to get registered events." });
  }
};

exports.getAttendingEventsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const events = await Event.getAttendingEventsForStudent(studentId);
    res.send(events);
  } catch (err) {
    console.error("Error fetching attending events for student:", err);
    res.status(500).send({ message: "Failed to get attending events." });
  }
};

exports.markAttendance = async (req, res) => {
  const eventId = req.params.id;
  const studentIds = req.body.studentIds;

  if (!eventId || !Array.isArray(studentIds) || studentIds.length === 0) {
    console.error("Invalid payload received:", req.body);
    return res.status(400).send({ message: "Invalid eventId or studentIds." });
  }

  try {
    console.log(
      `Marking attendance for eventId: ${eventId}, studentIds:`,
      studentIds,
    );

    const data = await Event.markAttendance(eventId, studentIds);
    console.log("Database update result:", data);
    res.send(data);
  } catch (err) {
    console.error("Error marking attendance:", err);
    res
      .status(500)
      .send({ message: "Error marking attendance.", error: err.message });
  }
};

exports.getRegisteredStudents = async (req, res) => {
  const eventId = req.params.id; // Get event ID from request params
  try {
    const students = await Event.getRegisteredStudents(eventId);
    res.send(students);
  } catch (err) {
    console.error("Error retrieving registered students:", err);
    res.status(500).send({
      message: "Error retrieving registered students.",
      error: err.message, // Include error message for debugging
    });
  }
};

exports.getAttendingStudents = async (req, res) => {
  const eventId = req.params.id; // Get event ID from request params
  try {
    const students = await Event.getAttendingStudents(eventId);
    res.send(students);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving attending students.",
      error: err.message,
    });
  }
};

exports.getEventFulfillableExperiences = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const data = await Event.getEventFulfillableExperiences(eventId, studentId);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Error retrieving fulfillable experiences for event.",
    });
    console.log("Could not get fulfillable experiences:", err);
  }
};

exports.getEventsForExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const events = await Event.getEventsForExperience(experienceId);
    res.send(events);
  } catch (err) {
    console.error("Error fetching events for experience:", err);
    res.status(500).send({ message: "Failed to get events for experience." });
  }
};

exports.generateCheckInToken = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { expirationTimestamp } = req.body;

    // Validate expiration timestamp if provided
    if (expirationTimestamp !== undefined) {
      const timestamp = new Date(expirationTimestamp);
      if (isNaN(timestamp.getTime())) {
        return res.status(400).send({
          message: "Invalid expiration timestamp format",
        });
      }
    }

    const checkInToken = await Event.generateEventCheckInToken(
      eventId,
      expirationTimestamp,
    );

    res.send({
      token: checkInToken.token,
      expirationTimestamp: checkInToken.expirationTimestamp,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error generating check-in token.",
    });
    console.log("Could not generate check-in token:", err);
  }
};

exports.getCheckInToken = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { expirationTimestamp } = req.body;

    // Validate expiration timestamp if provided
    if (expirationTimestamp !== undefined) {
      const timestamp = new Date(expirationTimestamp);
      if (isNaN(timestamp.getTime())) {
        return res.status(400).send({
          message: "Invalid expiration timestamp format",
        });
      }
    }

    const checkInToken = await Event.getEventCheckInToken(
      eventId,
      expirationTimestamp,
    );
    if (!checkInToken) {
      return res.status(404).send({
        message: "Check-in token not found",
      });
    }
    res.send({
      token: checkInToken.token,
      expirationTimestamp: checkInToken.expirationTimestamp,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error getting check-in token.",
    });
    console.log("Could not get check-in token:", err);
  }
};

exports.checkInStudent = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).send({
        message: "Check-in token is required",
      });
    }

    const checkIn = await Event.checkInStudent(eventId, studentId, token);
    res.send({
      message: "Successfully checked in to event",
      checkIn,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error checking in student to event",
    });
    console.log("Could not check in student:", err);
  }
};

exports.importAttendance = async (req, res) => {
  try {
    const attendanceData = req.body; // The data is sent directly, not wrapped in attendanceData
    const result = await Event.importAttendance(attendanceData);
    res.send({ success: true, ...result });
  } catch (err) {
    console.error("Error importing attendance:", err);
    res.status(500).send({
      success: false,
      message: err.message || "Failed to import attendance.",
    });
  }
};

export default exports;
