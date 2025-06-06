import { Sequelize } from "sequelize";

import BadExpTask from "./badExpTask.model.js";
import BadgeAwarded from "./badgeAwarded.model.js";
import Badge from "./badge.model.js";
import Event from "./event.model.js";
import EventCheckinTokens from "./eventCheckinTokens.js";
import EventType from "./eventType.model.js";
import Experience from "./experience.model.js";
import ExperienceStrength from "./experienceStrength.model.js";
import ExperienceMajor from "./experienceMajor.model.js";
import FlightPlan from "./flightPlan.model.js";
import FlightPlanItem from "./flightPlanItem.model.js";
import Link from "./link.model.js";
import Major from "./major.model.js";
import Notification from "./notification.model.js";
import Reward from "./reward.model.js";
import Role from "./role.model.js";
import Semester from "./semester.model.js";
import Strength from "./strength.model.js";
import Student from "./student.model.js";
import Task from "./task.model.js";
import User from "./user.model.js";
import Session from "./session.model.js";
import StudentReward from "./studentReward.model.js";
import StudentStrength from "./studentStrength.model.js";
import Submission from "./submission.model.js";
import EventStudents from "./eventStudents.model.js";

const db = {};

db.badExpTask = BadExpTask;
db.badgeAwarded = BadgeAwarded;
db.badge = Badge;
db.event = Event;
db.eventCheckinTokens = EventCheckinTokens;
db.eventType = EventType;
db.experience = Experience;
db.experienceStrength = ExperienceStrength;
db.experienceMajor = ExperienceMajor;
db.flightPlan = FlightPlan;
db.flightPlanItem = FlightPlanItem;
db.link = Link;
db.major = Major;
db.notification = Notification;
db.reward = Reward;
db.role = Role;
db.semester = Semester;
db.strength = Strength;
db.student = Student;
db.task = Task;
db.user = User;
db.session = Session;
db.studentReward = StudentReward;
db.StudentStrength = StudentStrength;
db.submission = Submission;
db.eventStudents = EventStudents;

db.Sequelize = Sequelize;

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

User.hasMany(Notification);
Notification.belongsTo(
  User,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// foreign key for student/users
db.user.hasOne(db.student, { as: "student", foreignKey: "userId" });
db.student.belongsTo(db.user, { as: "user", foreignKey: "userId" });
// Joint Tables

// USERROLE
User.belongsToMany(Role, { through: "userRole" });
Role.belongsToMany(User, { through: "userRole" });

// BADEXPTASK
Badge.belongsToMany(Task, { through: db.badExpTask });
Task.belongsToMany(Badge, { through: db.badExpTask });

Badge.belongsToMany(Experience, { through: db.badExpTask });
Experience.belongsToMany(Badge, { through: db.badExpTask });

// BADGEAWARDED
Badge.hasMany(BadgeAwarded, { foreignKey: "badgeId", as: "badgeAwarded" });
BadgeAwarded.belongsTo(Badge, { foreignKey: "badgeId", as: "badge" });

Student.hasMany(BadgeAwarded, { foreignKey: "studentId", as: "badgeAwarded" });
BadgeAwarded.belongsTo(Student, { foreignKey: "studentId", as: "student" });

// STUDENTMAJOR
Student.belongsToMany(Major, { through: "studentMajor" });
Major.belongsToMany(Student, { through: "studentMajor" });

Student.belongsToMany(Reward, {
  through: { model: StudentReward, unique: false },
});
Reward.belongsToMany(Student, {
  through: { model: StudentReward, unique: false },
});

// TASKMAJOR
Task.belongsToMany(Major, { through: "taskMajor" });
Major.belongsToMany(Task, { through: "taskMajor" });

// TaskStrength
Task.belongsToMany(Strength, { through: "taskStrength" });
Strength.belongsToMany(Task, { through: "taskStrength" });

// EXPERIENCEMAJORS
Experience.belongsToMany(Major, {
  through: ExperienceMajor,
  foreignKey: "experienceId",
  onDelete: "CASCADE",
});
Major.belongsToMany(Experience, {
  through: ExperienceMajor,
  foreignKey: "majorId",
  onDelete: "CASCADE",
});

// ExperienceStrength
Experience.belongsToMany(Strength, {
  through: ExperienceStrength,
  foreignKey: "experienceId",
  onDelete: "CASCADE",
});
Strength.belongsToMany(Experience, {
  through: ExperienceStrength,
  foreignKey: "strengthId",
  onDelete: "CASCADE",
});

// EXPOPTIONS
Experience.belongsToMany(Event, { through: "expOption", as: "events" });
Event.belongsToMany(Experience, { through: "expOption", as: "experiences" });

// EVENTSTRENGTH
Event.belongsToMany(Strength, { through: "eventStrength" });
Strength.belongsToMany(Event, { through: "eventStrength" });

Student.belongsToMany(Strength, {
  through: StudentStrength,
  foreignKey: "studentId",
});
Strength.belongsToMany(Student, {
  through: StudentStrength,
  foreignKey: "strengthId",
});

// Define associations
EventStudents.belongsTo(Student, { foreignKey: "studentId" });
EventStudents.belongsTo(Event, { foreignKey: "eventId" });
EventStudents.belongsTo(Student, { foreignKey: "studentId" });
EventStudents.belongsTo(Event, { foreignKey: "eventId" });

//Event to Students
db.event.belongsToMany(db.student, {
  through: db.eventStudents,
  foreignKey: "eventId",
  otherKey: "studentId",
});

db.student.belongsToMany(db.event, {
  through: db.eventStudents,
  foreignKey: "studentId",
  otherKey: "eventId",
});

// Event Check-In Tokens to Event
db.event.hasMany(db.eventCheckinTokens, {
  as: "checkinTokens",
  foreignKey: { name: "eventId", allowNull: false },
});

db.eventCheckinTokens.belongsTo(db.event, {
  as: "event",
  foreignKey: { name: "eventId", allowNull: false },
});

/// Flight Plan to Semester
db.flightPlan.belongsTo(db.semester, {
  as: "semester",
  foreignKey: { name: "semesterId", allowNull: false },
});
db.semester.hasMany(db.flightPlan, {
  as: "flightPlans",
  foreignKey: { name: "semesterId", allowNull: false },
});

db.student.hasOne(db.link, {
  as: "link", // Alias for the link in the student model
  foreignKey: {
    name: "studentId", // The foreign key in the links table
    allowNull: false, // The foreign key cannot be null
  },
});

// In the link model:
db.link.belongsTo(db.student, {
  as: "student", // Alias for the student in the link model
  foreignKey: {
    name: "studentId", // The foreign key in the links table
    allowNull: false, // The foreign key cannot be null
  },
});

// Flight plan to student
db.flightPlan.hasOne(db.student, {
  as: "student",
  foreignKey: { name: "id", allowNull: false },
});
db.student.hasMany(db.flightPlan);

// Flight plan to Flight plan Item
db.flightPlanItem.hasOne(db.flightPlan, {
  as: "flightPlan",
  foreignKey: { name: "id", allowNull: false },
});
db.flightPlan.hasMany(db.flightPlanItem);

// Flight plan to Task
// FlightPlanItem belongs to Task
db.flightPlanItem.belongsTo(db.task, {
  as: "task",
  foreignKey: { name: "taskId", allowNull: true },
});
db.task.hasMany(db.flightPlanItem, {
  foreignKey: { name: "taskId", allowNull: true },
});

// FlightPlanItem belongs to Event
db.flightPlanItem.belongsTo(db.event, {
  as: "event",
  foreignKey: { name: "eventId", allowNull: true },
});
db.event.hasMany(db.flightPlanItem, {
  foreignKey: { name: "eventId", allowNull: true },
});

// FlightPlanItem belongs to Experience
db.flightPlanItem.belongsTo(db.experience, {
  as: "experience",
  foreignKey: { name: "experienceId", allowNull: true },
});
db.experience.hasMany(db.flightPlanItem, {
  foreignKey: { name: "experienceId", allowNull: true },
});

db.submission.belongsTo(db.flightPlanItem, {
  as: "flightPlanItem",
  foreignKey: { name: "flightPlanItemId", allowNull: false },
});
db.flightPlanItem.hasMany(db.submission, {
  as: "submission",
});

// notificaiton to user
Notification.belongsTo(User, { foreignKey: "sentBy" });
User.hasMany(Notification, { foreignKey: "sentBy" });

export default db;
