import db from "../models/index.js";
import { Op } from "sequelize";
import crypto from "crypto";
const Event = db.event;
const EventCheckInToken = db.eventCheckinTokens;
const Strength = db.strength;
const EventStudents = db.eventStudents;
import studentServices from "../sequelizeUtils/student.js";
import kickOffBadgeAwarding from "../utilities/badgeAward.helpers.js";
import notificationServices from "../sequelizeUtils/notification.js";
import userServices from "../sequelizeUtils/user.js";

const exports = {};

exports.findAllEvents = async (
  page = 1,
  pageSize = 10,
  searchQuery = "",
  filters = {},
) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const whereCondition = {};

  if (searchQuery) {
    whereCondition.name = { [Op.like]: `%${searchQuery}%` };
  }

  if (filters.startDate) {
    whereCondition.date = { [Op.gte]: new Date(filters.startDate) };
  }

  if (filters.endDate) {
    whereCondition.date = {
      ...whereCondition.date,
      [Op.lte]: new Date(filters.endDate),
    };
  }

  if (filters.location) {
    whereCondition.location = { [Op.like]: `%${filters.location}%` };
  }

  let order = [];

  if (filters.sortAttribute && filters.sortDirection) {
    // Default to ascending order if direction is not provided
    const direction =
      filters.sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    order = [[filters.sortAttribute, direction]];
  }

  const queryOptions = {
    offset,
    limit,
    where: whereCondition,
    include: [],
    order,
  };

  if (filters.strengths && filters.strengths.length > 0) {
    queryOptions.include.push({
      model: Strength,
      where: { id: { [Op.in]: filters.strengths.map(Number) } },
      required: true, // Ensures only events with matching strengths are included
    });
  }

  const events = await Event.findAll(queryOptions);

  const count = await Event.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { events, count: totalPages };
};

exports.findOneEvent = async (eventId) => {
  return await Event.findByPk(eventId, {
    include: [{ model: db.experience, as: "experiences" }],
  });
};

exports.findPastEventsWithUpcoming = async () => {
  const data = await Event.findAll({
    where: {
      status: "Upcoming",
      endTime: {
        [Op.lt]: new Date(),
      },
    },
  });
  return data;
};

exports.findEventByToken = async (eventToken) => {
  const data = await EventCheckInToken.findOne({
    where: {
      token: eventToken,
      expirationTimestamp: {
        [Op.gt]: new Date(), // Only accept tokens that haven't expired
      },
    },
    include: [
      {
        model: Event,
        as: "event",
      },
    ],
  });
  return data?.event;
};

exports.createEvent = async (eventData) => {
  const event = await Event.create(eventData);
  await createOrUpdateEventExperiences(event.id, eventData.experiences);
  return event;
};

exports.updateEvent = async (eventData, eventId) => {
  await createOrUpdateEventExperiences(eventId, eventData.experiences);
  return await Event.update(eventData, { where: { id: eventId } });
};

const createOrUpdateEventExperiences = async (eventId, experiences) => {
  // Get the event instance
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Remove all existing experience associations
  await event.setExperiences([]);

  if (experiences && experiences.length > 0) {
    // Create new experience associations
    const experienceIds = experiences.map((exp) => exp.id);
    await event.addExperiences(experienceIds);
  }
};

exports.deleteEvent = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    return "Successfully deleted event";
  }
  await event.setExperiences([]);
  return await Event.destroy({ where: { id: eventId } });
};

exports.getRegistrationTypes = () => {
  return Event.getAttributes().registration.values;
};

exports.getAttendanceTypes = () => {
  return Event.getAttributes().attendanceType.values;
};

// exports.getEventTypes = () => {
//   return Event.getAttributes().attendanceType.values;
// };

exports.getCompletionTypes = () => {
  return Event.getAttributes().completionType.values;
};

exports.getEventFulfillableExperiences = async (eventId, studentId) => {
  // Get the event with its associated experiences through the expOption join table
  const event = await Event.findByPk(eventId, {
    include: [
      {
        model: db.experience,
        through: { attributes: [] }, // Don't include join table attributes
        as: "experiences",
      },
    ],
  });

  if (!event) {
    throw new Error(`Event with id ${eventId} not found`);
  }

  // Get the student's active flight plan
  const student = await db.student.findOne({
    where: { id: studentId },
    include: [
      {
        model: db.flightPlan,
        include: [
          {
            model: db.flightPlanItem,
            include: [
              {
                model: db.experience,
                as: "experience",
              },
            ],
          },
        ],
      },
    ],
  });

  if (!student || !student.flightPlans || student.flightPlans.length === 0) {
    throw new Error(`No active flight plan found for student ${studentId}`);
  }

  // Get the most recent flight plan
  const activeFlightPlan = student.flightPlans[0];

  // Get all incomplete flight plan items with experiences
  const incompleteFlightPlanItems = activeFlightPlan.flightPlanItems.filter(
    (item) => item.status !== "Complete" && item.experience,
  );

  // Cross-reference the event's experiences with the flight plan items
  const fulfillableFlightPlanItems = incompleteFlightPlanItems.filter(
    (flightPlanItem) =>
      event.experiences.some(
        (eventExp) => eventExp.id === flightPlanItem.experience.id,
      ),
  );

  return {
    eventId,
    eventName: event.name,
    fulfillableFlightPlanItems: fulfillableFlightPlanItems.map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
      dueDate: item.dueDate,
      experience: {
        id: item.experience.id,
        name: item.experience.name,
        description: item.experience.description,
        points: item.experience.points,
      },
    })),
  };
};

exports.generateEventCheckInToken = async (eventId, expirationTimestamp) => {
  // Generate a token using timestamp and eventId
  const timestamp = Date.now();
  const token = crypto
    .createHash("md5")
    .update(`${eventId}-${timestamp}`)
    .digest("hex");

  // Get the event to check its end time
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error(`Event with id ${eventId} not found`);
  }

  // Use provided expiration timestamp, event end time, or default to 24 hours from now
  const finalExpirationTimestamp = expirationTimestamp
    ? new Date(expirationTimestamp)
    : event.endTime
      ? new Date(event.endTime)
      : new Date(timestamp + 24 * 60 * 60 * 1000);

  // Create the token in the database
  const checkInToken = await EventCheckInToken.create({
    token,
    eventId,
    expirationTimestamp: finalExpirationTimestamp,
  });

  return checkInToken;
};

exports.getEventCheckInToken = async (eventId) => {
  // Get the event to check its end time
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error(`Event with id ${eventId} not found`);
  }

  // Find the most recent valid token for this event
  const currentToken = await EventCheckInToken.findOne({
    where: {
      eventId,
      expirationTimestamp: {
        [Op.gt]: new Date(), // Only get tokens that haven't expired
      },
    },
    order: [["createdAt", "DESC"]], // Get the most recent token
  });

  return currentToken;
};

exports.getEventFulfillableExperiences = async (eventId, studentId) => {
  // Get the event with its associated experiences through the expOption join table
  const event = await Event.findByPk(eventId, {
    include: [
      {
        model: db.experience,
        through: { attributes: [] }, // Don't include join table attributes
        as: "experiences",
      },
    ],
  });

  if (!event) {
    throw new Error(`Event with id ${eventId} not found`);
  }

  // Get the student's active flight plan
  const student = await db.student.findOne({
    where: { id: studentId },
    include: [
      {
        model: db.flightPlan,
        include: [
          {
            model: db.flightPlanItem,
            include: [
              {
                model: db.experience,
                as: "experience",
              },
            ],
          },
        ],
      },
    ],
  });

  if (!student || !student.flightPlans || student.flightPlans.length === 0) {
    throw new Error(`No active flight plan found for student ${studentId}`);
  }

  // Get the most recent flight plan
  const activeFlightPlan = student.flightPlans[0];

  // Get all incomplete flight plan items with experiences
  const incompleteFlightPlanItems = activeFlightPlan.flightPlanItems.filter(
    (item) => item.status !== "Complete" && item.experience,
  );

  // Cross-reference the event's experiences with the flight plan items
  const fulfillableFlightPlanItems = incompleteFlightPlanItems.filter(
    (flightPlanItem) =>
      event.experiences.some(
        (eventExp) => eventExp.id === flightPlanItem.experience.id,
      ),
  );

  return {
    eventId,
    eventName: event.name,
    fulfillableFlightPlanItems: fulfillableFlightPlanItems.map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
      dueDate: item.dueDate,
      experience: {
        id: item.experience.id,
        name: item.experience.name,
        description: item.experience.description,
        points: item.experience.points,
      },
    })),
  };
};

exports.generateEventCheckInToken = async (eventId, expirationTimestamp) => {
  // Generate a token using timestamp and eventId
  const timestamp = Date.now();
  const token = crypto
    .createHash("md5")
    .update(`${eventId}-${timestamp}`)
    .digest("hex");

  // Get the event to check its end time
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error(`Event with id ${eventId} not found`);
  }

  // Use provided expiration timestamp, event end time, or default to 24 hours from now
  const finalExpirationTimestamp = expirationTimestamp
    ? new Date(expirationTimestamp)
    : event.endTime
      ? new Date(event.endTime)
      : new Date(timestamp + 24 * 60 * 60 * 1000);

  // Create the token in the database
  const checkInToken = await EventCheckInToken.create({
    token,
    eventId,
    expirationTimestamp: finalExpirationTimestamp,
  });

  return checkInToken;
};

exports.getEventCheckInToken = async (eventId) => {
  // Get the event to check its end time
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error(`Event with id ${eventId} not found`);
  }

  // Find the most recent valid token for this event
  const currentToken = await EventCheckInToken.findOne({
    where: {
      eventId,
      expirationTimestamp: {
        [Op.gt]: new Date(), // Only get tokens that haven't expired
      },
    },
    order: [["createdAt", "DESC"]], // Get the most recent token
  });

  return currentToken;
};

// Method to register students for an event
exports.registerStudents = async (eventId, studentIds) => {
  const registrations = studentIds.map((studentId) => ({
    eventId,
    studentId,
    attended: false,
    recordedTime: null,
  }));
  return await EventStudents.bulkCreate(registrations);
};

exports.unregisterStudents = async (eventId, studentIds) => {
  return await EventStudents.destroy({
    where: {
      eventId,
      studentId: {
        [Op.in]: studentIds,
      },
    },
  });
};

exports.getRegisteredEventsForStudent = async (studentId) => {
  return await db.eventStudents
    .findAll({
      where: { studentId },
      include: [db.event],
    })
    .then((records) => records.map((r) => r.event));
};

exports.getAttendingEventsForStudent = async (studentId) => {
  return await db.eventStudents
    .findAll({
      where: {
        studentId,
        attended: true,
      },
      include: [db.event],
    })
    .then((records) => records.map((r) => r.event));
};

// In your backend, modify the markAttendance function to toggle the attendance status
exports.markAttendance = async (eventId, studentIds) => {
  try {
    // Fetch the event along with its associated experiences
    const eventWithExperiences = await db.event.findByPk(eventId, {
      include: [
        {
          model: db.experience,
          as: "experiences",
          through: { attributes: [] },
        },
      ],
    });

    if (!eventWithExperiences) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    const eventExperienceIds = eventWithExperiences.experiences.map(
      (exp) => exp.id,
    );

    for (const studentId of studentIds) {
      const eventStudent = await EventStudents.findOne({
        where: { eventId, studentId },
      });

      if (!eventStudent) continue;

      // Toggle attendance
      eventStudent.attended = !eventStudent.attended;
      eventStudent.recordedTime = eventStudent.attended ? Date.now() : null;
      await eventStudent.save();

      const flightPlans = await db.flightPlan.findAll({ where: { studentId } });
      const flightPlanIds = flightPlans.map((fp) => fp.id);

      if (flightPlanIds.length === 0) continue;

      // Fetch flight plan items that are associated with the event's experiences
      const flightPlanItems = await db.flightPlanItem.findAll({
        where: {
          flightPlanId: { [Op.in]: flightPlanIds },
          experienceId: { [Op.in]: eventExperienceIds },
          eventId: eventId,
        },
      });

      console.log("Flight plan Items: ", flightPlanItems)

      for (const item of flightPlanItems) {
        const experience = eventWithExperiences.experiences.find(
          (exp) => exp.id === item.experienceId,
        );
        if (!experience) continue;

        console.log(item.status)
        console.log(experience.submissionType)
        console.log(experience.submissionType.includes("Attendance"))
        console.log(item.status === "Pending Attendance" && experience.submissionType.includes("Attendance"))
        if (eventStudent.attended) {
          if (item.status !== "Complete" && experience.submissionType === "Attendance - Auto Approve") {
            await item.update({
              status: "Complete",
              pointsEarned: experience.points,
            });
            let studentId = await studentServices.findById(studentId);
            let userId = await userServices.findById(studentId.userId);
            await notificationServices.createNotification({      
              header: `${experience.name} Flight Plan Item Completion`,
              description: `You have received ${experience.points} points for completing ${experience.name}`,
              read: false,
              userId: userId,
              sentBy: null
            });
            await studentServices.updatePoints(studentId, experience.points);
            await kickOffBadgeAwarding(item.id);
          }
          else if (item.status !== "Complete" && 
            item.status !== "Pending Attendance" && 
            (experience.submissionType === "Attendance - Reflection - Review" || 
              experience.submissionType === "Attendance - Reflection - Auto Approve")) {
            await item.update({
              status: "Awaiting Reflection",
              pointsEarned: 0,
            });
          }
          else if (item.status !== "Complete" && 
            item.status !== "Pending Attendance" && 
            (experience.submissionType === "Attendance - Document - Review" || 
              experience.submissionType === "Attendance - Document - Auto Approve")) {
            await item.update({
              status: "Awaiting Document",
              pointsEarned: 0,
            });
          }
          else if (item.status === "Pending Attendance" && experience.submissionType.includes("Attendance")) {
            console.log("Made it to corrent")
            await item.update({
              status: "Complete",
              pointsEarned: experience.points,
            });
            let studentId = await studentServices.findById(studentId);
            let userId = await userServices.findById(studentId.userId);
            await notificationServices.createNotification({      
              header: `${experience.name} Flight Plan Item Completion`,
              description: `You have received ${experience.points} points for completing ${experience.name}`,
              read: false,
              userId: userId,
              sentBy: null
            });
            await studentServices.updatePoints(studentId, experience.points);
            await kickOffBadgeAwarding(item.id);
          }
          else if (item.status === "Complete" || !item.status.includes("Attendance")) {
            console.log("Status was complete")
            continue;
          }
          else { 
            console.error("Was not able to update item status for experience: ", experience.name);
            console.log("Item status: ", item.status);
            console.log("Item submission type: ", experience.submissionType);

          }
        } else {
          if (item.status === "Complete") {
            await item.update({
              status: "Registered",
              pointsEarned: 0,
            });
            await studentServices.updatePoints(studentId, -experience.points);
          }
        }
      }
    }

    return { message: "Attendance, status, and points updated." };
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw new Error("Error marking attendance.");
  }
};

// Method to fetch students registered for an event
exports.getRegisteredStudents = async (eventId) => {
  try {
    const students = await EventStudents.findAll({
      where: { eventId },
      include: [
        {
          model: db.student,
          include: [{ model: db.user, as: "user" }], // Include user data
        },
      ],
      raw: true, // Raw true will make Sequelize return a plain object (avoids circular reference)
    });

    // Transform the data to remove circular references and return a cleaner structure
    const studentsWithAttendanceStatus = students.map((eventStudent) => ({
      id: eventStudent.id,
      studentId: eventStudent.studentId,
      attendedStatus: eventStudent.attended,
      recordedTime: eventStudent.recordedTime,
      user: {
        id: eventStudent["student.user.id"],
        fName: eventStudent["student.user.fName"],
        lName: eventStudent["student.user.lName"],
        fullName: eventStudent["student.user.fullName"],
        email: eventStudent["student.user.email"],
      },
    }));
    return studentsWithAttendanceStatus;
  } catch (error) {
    console.error("Error fetching registered students:", error);
    throw new Error("Error retrieving registered students.");
  }
};

// Method to fetch attending students for an event
exports.getAttendingStudents = async (eventId) => {
  try {
    const students = await EventStudents.findAll({
      where: { eventId, attended: true },
      include: [
        {
          model: db.student,
          include: [{ model: db.user, as: "user" }], // Include user data
        },
      ],
    });
    return students;
  } catch (error) {
    console.error("Error fetching attending students:", error);
    throw new Error("Error retrieving attending students.");
  }
};

exports.checkInStudent = async (eventId, studentId, token) => {
  // Get the event to verify it exists
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error(`Event with id ${eventId} not found`);
  }

  // Get the student to verify they exist
  const student = await db.student.findByPk(studentId);
  if (!student) {
    throw new Error(`Student with id ${studentId} not found`);
  }

  // Find the token and verify it's valid
  const checkInToken = await EventCheckInToken.findOne({
    where: {
      eventId,
      token,
      expirationTimestamp: {
        [Op.gt]: new Date(), // Only accept tokens that haven't expired
      },
    },
  });

  if (!checkInToken) {
    throw new Error("Invalid or expired check-in token");
  }

  // Check if student is already checked in
  const existingCheckIn = await db.eventStudents.findOne({
    where: {
      eventId,
      studentId,
    },
  });

  if (existingCheckIn && existingCheckIn.attended) {
    throw new Error("Student is already checked in to this event");
  } else if (existingCheckIn) {
    // Update existing check-in record
    existingCheckIn.attended = true;
    await existingCheckIn.save();
    return existingCheckIn;
  }

  // Create the check-in record
  const checkIn = await db.eventStudents.create({
    eventId,
    studentId,
    attended: true,
    checkInTime: new Date(),
  });

  return checkIn;
};

exports.importAttendance = async (attendanceData) => {
  const results = {
    success: [],
    failed: [],
  };

  const processedEmails = new Set(); // eslint-disable-line no-undef

  for (const record of attendanceData) {
    try {
      if (processedEmails.has(record.email)) continue;
      processedEmails.add(record.email);

      // Find user by email
      const user = await db.user.findOne({
        where: { email: record.email },
        include: [{ model: db.student, as: "student" }],
      });

      if (!user || !user.student) {
        results.failed.push({
          email: record.email,
          reason: "User not found or is not a student",
        });
        continue;
      }

      const studentId = user.student.id;

      // Get the event and its experiences
      const event = await db.event.findByPk(record.eventId, {
        include: [
          {
            model: db.experience,
            as: "experiences",
            through: { attributes: [] },
          },
        ],
      });

      if (!event) {
        results.failed.push({ email: record.email, reason: "Event not found" });
        continue;
      }

      const eventExperienceIds = event.experiences.map((exp) => exp.id);

      // Ensure student is registered
      let eventStudent = await EventStudents.findOne({
        where: {
          eventId: record.eventId,
          studentId,
        },
      });

      if (!eventStudent) {
        eventStudent = await EventStudents.create({
          eventId: record.eventId,
          studentId,
          attended: true,
          recordedTime: new Date(record.checkedIn),
        });
      } else {
        await eventStudent.update({
          attended: true,
          recordedTime: new Date(record.checkedIn),
        });
      }

      // Fetch flight plan items for student
      const flightPlans = await db.flightPlan.findAll({ where: { studentId } });
      const flightPlanIds = flightPlans.map((fp) => fp.id);

      const flightPlanItems = await db.flightPlanItem.findAll({
        where: {
          flightPlanId: { [Op.in]: flightPlanIds },
          experienceId: { [Op.in]: eventExperienceIds },
          eventId: record.eventId,
        },
      });

      for (const item of flightPlanItems) {
        const experience = event.experiences.find(
          (exp) => exp.id === item.experienceId,
        );
        if (!experience) continue;

        if (item.status !== "Complete") {
          await item.update({
            status: "Complete",
            pointsEarned: experience.points,
          });
          await studentServices.updatePoints(studentId, experience.points);
          await kickOffBadgeAwarding(item.id);
        }
      }

      results.success.push({ email: record.email, studentId });
    } catch (error) {
      results.failed.push({ email: record.email, reason: error.message });
    }
  }

  return results;
};

exports.getEventsForExperience = async (experienceId) => {
  return await db.event.findAll({
    include: [
      {
        model: db.experience,
        through: { attributes: [] },
        as: "experiences",
        where: { id: experienceId },
        required: true,
      },
    ],
    order: [["date", "ASC"]], // optional: sort upcoming first
  });
};

exports.addStrength = async (eventId, strengthId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  return await event.addStrength(strengthId);
};

exports.removeStrength = async (eventId, strengthId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  // Changes the return value to be more descriptive, also prevents errors for sucessful removal
  const result = await event.removeStrength(strengthId);
  if (result === 1) {
    return { success: true, message: "Strength removed successfully." };
  } else {
    return {
      success: false,
      message: "Strength not found or already removed.",
    };
  }
};

exports.addMajor = async (eventId, majorId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  return await event.addMajor(majorId);
};

exports.removeMajor = async (eventId, majorId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  // Changes the return value to be more descriptive, also prevents errors for sucessful removal
  const result = await event.removeMajor(majorId);
  if (result === 1) {
    return { success: true, message: "Major removed successfully." };
  } else {
    return { success: false, message: "Major not found or already removed." };
  }
};

export default exports;
