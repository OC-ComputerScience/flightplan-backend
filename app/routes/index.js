import { Router } from "express";

import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";
import RoleRoutes from "./role.routes.js";
import UserRoleRoutes from "./userrole.routes.js";
import RewardRoutes from "./reward.routes.js";
import NotificationRoutes from "./notification.routes.js";
import BadgeRoutes from "./badge.routes.js";
import LinkRoutes from "./link.routes.js";
import ExperienceRoutes from "./experience.routes.js";
import EventRoutes from "./event.routes.js";
import TaskRoutes from "./task.routes.js";
import FlightPlanRoutes from "./flightPlan.routes.js";
import FlightPlanItemRoutes from "./flightPlanItem.routes.js";
import StrengthRoutes from "./strength.routes.js";
import StudentRoutes from "./student.routes.js";
import SubmissionRoutes from "./submission.routes.js";
import FileRoutes from "./file.routes.js";
import MajorRoutes from "./major.routes.js";
import SemesterRoutes from "./semester.routes.js";
const router = Router();

router.use("/", AuthRoutes);
router.use("/user", UserRoutes);

router.use("/role", RoleRoutes);
router.use("/userrole", UserRoleRoutes);
router.use("/reward", RewardRoutes);
router.use("/notification", NotificationRoutes);
router.use("/badge", BadgeRoutes);
router.use("/experience", ExperienceRoutes);
router.use("/event", EventRoutes);
router.use("/task", TaskRoutes);
router.use("/link", LinkRoutes);
router.use("/flightPlan", FlightPlanRoutes);
router.use("/flightPlanItem", FlightPlanItemRoutes);
router.use("/strengths", StrengthRoutes);
router.use("/students", StudentRoutes);
router.use("/submission", SubmissionRoutes);
router.use("/file", FileRoutes);
router.use("/majors", MajorRoutes);
router.use("/semesters", SemesterRoutes);
// eslint-disable-next-line
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Team 1's Eagle Flight Plan API." });
});

export default router;
