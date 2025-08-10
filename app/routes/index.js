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
import StudentRewards from "./studentReward.routes.js";
import SubmissionRoutes from "./submission.routes.js";
import FileRoutes from "./file.routes.js";
import MajorRoutes from "./major.routes.js";
import SemesterRoutes from "./semester.routes.js";
import EmailRoutes from "./email.routes.js";
import ColleagueRoutes from "./colleague.routes.js";

// Resume Items
import AwardItemRoutes from "./awardItem.routes.js";
import EducationItemRoutes from "./educationItem.routes.js";
import WorkExperienceItemRoutes from "./workExperienceItem.routes.js";
import LinkItemRoutes from "./linkItem.routes.js";
import ProfessionalSummaryItemRoutes from "./professionalSummaryItem.routes.js";
import ProjectItemRoutes from "./projectItem.routes.js";
import SkillItemRoutes from "./skillItem.routes.js";

// Resume

import AwardRoutes from "./award.routes.js";
import CommentRoutes from "./comment.routes.js";
import EducationRoutes from "./education.routes.js";
import ProfessionalSummaryRoutes from "./professionalSummary.routes.js";
import ProjectRoutes from "./project.routes.js";
import ResumeRoutes from "./resume.routes.js";
import ResumeSectionRoutes from "./resumeSection.routes.js";
import SkillRoutes from "./skill.routes.js";
import TemplateRoutes from "./template.routes.js";
import WorkExperienceRoutes from "./workExperience.routes.js";

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
router.use("/studentRewards", StudentRewards);
router.use("/submission", SubmissionRoutes);
router.use("/file", FileRoutes);
router.use("/majors", MajorRoutes);
router.use("/semesters", SemesterRoutes);
router.use("/email", EmailRoutes);
router.use("/colleague", ColleagueRoutes);

// Resume Items
router.use("/awardItems", AwardItemRoutes);
router.use("/educationItems", EducationItemRoutes);
router.use("/workExperienceItems", WorkExperienceItemRoutes);
router.use("/linkItems", LinkItemRoutes);
router.use("/professionalSummaryItems", ProfessionalSummaryItemRoutes);
router.use("/projectItems", ProjectItemRoutes);
router.use("/skillItems", SkillItemRoutes);

// Resume
router.use("/awards", AwardRoutes);
router.use("/comments", CommentRoutes);
router.use("/educations", EducationRoutes);
router.use("/professionalSummaries", ProfessionalSummaryRoutes);
router.use("/projects", ProjectRoutes);
router.use("/resumes", ResumeRoutes);
router.use("/resumeSections", ResumeSectionRoutes);
router.use("/skills", SkillRoutes);
router.use("/templates", TemplateRoutes);
router.use("/workExperiences", WorkExperienceRoutes);

// eslint-disable-next-line
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Team 1's Eagle Flight Plan API." });
});

export default router;
