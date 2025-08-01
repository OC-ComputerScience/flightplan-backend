import db from "../models/index.js";
import { Op } from "sequelize";
const Task = db.task;
const Experience = db.experience;
const Student = db.student;
const Major = db.major;
const Strength = db.strength;
const FlightPlan = db.flightPlan;
const FlightPlanItem = db.flightPlanItem;

export const getFlightPlanItemsForNewFlightPlan = async (
  studentId,
  newFlightPlan,
) => {
  const student = await getStudentWithGenerationInfo(studentId);

  const completedItems = await getAllCompletedFlightPlanItemsForStudent(student);

  /* eslint-disable no-undef */
  const [taskItems, experienceItems] = await Promise.all([
    getTaskItems(completedItems, newFlightPlan, student),
    getExperienceItems(completedItems, newFlightPlan, student),
  ]);

  const formatItem = (type, item) => ({
    flightPlanItemType: type,
    status: "Incomplete",
    [`${type.toLowerCase()}Id`]: item.id,
    flightPlanId: newFlightPlan.id,
    name: item.name,
  });

  return [
    ...taskItems.map((task) => formatItem("Task", task)),
    ...experienceItems.map((exp) => formatItem("Experience", exp)),
  ];
};

const getStudentWithGenerationInfo = async (studentId) => {
  return await Student.findOne({
    where: { id: studentId },
    include: [
      { model: FlightPlan, as: "flightPlans" },
      { model: Major, as: "majors" },
      { model: Strength, as: "strengths" },
    ],
  });
};

const getAllCompletedFlightPlanItemsForStudent = async (student) => {
  const flightPlans = student.flightPlans
  const completedFlightPlanItems = await FlightPlanItem.findAll({
    where: {
      flightPlanId: {
        [Op.in]: flightPlans.map((flightPlan) => flightPlan.id),
      },
      status: "Complete",
    },
  });

  return completedFlightPlanItems;
};

const getTaskItems = async (completedItems, newFlightPlan, student) => {
  const completedTasks = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Task")
    .map(({ taskId, task }) => ({ taskId, task }));

  const allTasks = await getAllActiveSemesterValidTasks(
    newFlightPlan.semestersFromGrad,
  );

  // Filter tasks that aren't specific to a student's strengths or majors
  const nonSpecificTasks = allTasks.filter(
    (task) => task.strengths.length == 0 && task.majors.length == 0,
  );

  const finalNonSpecificTasks = processNonSpecificTasks(
    completedTasks,
    nonSpecificTasks,
  );

  // Filter tasks that are specific to a student's strengths or majors
  const specificTasks = allTasks.filter(
    (task) => task.strengths.length > 0 || task.majors.length > 0,
  );

  const finalSpecificTasks = processSpecificTasks(
    completedTasks,
    specificTasks,
    student,
  );

  return [...finalNonSpecificTasks, ...finalSpecificTasks];
};

const getAllActiveSemesterValidTasks = async (semestersFromGrad) => {
  const allTasks = await Task.findAll({
    include: [{ model: Strength }, { model: Major }],
    where: {
      semestersFromGrad: { [Op.gte]: semestersFromGrad },
      [Op.or]: [
        { semesterEnd: { [Op.lte]: semestersFromGrad } },
        { semesterEnd: null }
      ],
      status: "active", // <-- Only include active tasks
    }
  });
  return allTasks.filter((task) => task.semestersFromGrad >= semestersFromGrad && task.status == "active");
};

const processNonSpecificTasks = (
  completedTasks,
  nonSpecificTasks,
  semestersFromGrad,
) => {
  const oneTimeTasks = nonSpecificTasks.filter(
    (task) => task.schedulingType === "one-time",
  );

  const completedTaskIds = completedTasks.map(({ taskId }) => taskId);

  const uncompletedOneTimeTasks = oneTimeTasks.filter(
    (task) => !completedTaskIds.includes(task.id),
  );

  const everySemesterTasks = nonSpecificTasks.filter(
    (task) => task.schedulingType === "every-semester",
  );

  const everyOtherSemesterTasks = nonSpecificTasks.filter(
    (task) => task.schedulingType === "every-other-semester",
  );

  const uncompletedEveryOtherSemesterTasks = processEveryOtherSemesterTasks(
    completedTasks,
    everyOtherSemesterTasks,
    semestersFromGrad,
  );

  return [
    ...uncompletedOneTimeTasks,
    ...everySemesterTasks,
    ...uncompletedEveryOtherSemesterTasks,
  ];
};

const processSpecificTasks = (
  completedTasks,
  specificTasks,
  student,
  semestersFromGrad,
) => {
  const relevantSpecificTasks = specificTasks.filter(
    (task) =>
      task.strengths.some((strength) => student.strengths.includes(strength)) ||
      task.majors.some((major) => student.majors.includes(major)),
  );

  const oneTimeSpecificTasks = relevantSpecificTasks.filter(
    (task) => task.schedulingType === "one-time",
  );

  const completedTaskIds = completedTasks.map(({ taskId }) => taskId);

  const uncompletedOneTimeSpecificTasks = oneTimeSpecificTasks.filter(
    (task) => !completedTaskIds.includes(task.id),
  );

  const everySemesterSpecificTasks = relevantSpecificTasks.filter(
    (task) => task.schedulingType === "every-semester",
  );

  const everyOtherSemesterSpecificTasks = relevantSpecificTasks.filter(
    (task) => task.schedulingType === "every-other-semester",
  );

  const uncompletedEveryOtherSemesterSpecificTasks =
    processEveryOtherSemesterTasks(
      completedTasks,
      everyOtherSemesterSpecificTasks,
      semestersFromGrad,
    );

  return [
    ...uncompletedOneTimeSpecificTasks,
    ...everySemesterSpecificTasks,
    ...uncompletedEveryOtherSemesterSpecificTasks,
  ];
};

const processEveryOtherSemesterTasks = (
  completedTasks,
  tasks,
  semestersFromGrad,
) => {
  const isOddSemester = semestersFromGrad % 2 === 1;

  const relevantEveryOtherSemesterTasks = tasks.filter((task) => {
    // First check if this task is due in the current semester based on parity
    const taskIsDueThisSemester = isOddSemester
      ? task.semestersFromGrad % 2 === 1
      : task.semestersFromGrad % 2 === 0;

    if (!taskIsDueThisSemester) {
      return false;
    }

    // If task is due this semester, check if it was completed in the previous semester
    if (task.semestersFromGrad !== semestersFromGrad) {
      const wasCompletedLastSemester = completedTasks.some(
        ({ task: completedTask }) =>
          completedTask.id === task.id &&
          completedTask.semestersFromGrad === semestersFromGrad + 1,
      );

      if (wasCompletedLastSemester) {
        return false;
      }
    }

    return true;
  });

  return relevantEveryOtherSemesterTasks;
};

const getExperienceItems = async (
  completedItems,
  newFlightPlan,
  student,
  semestersFromGrad,
) => {
  const completedExperiences = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Experience")
    .map(({ experience, experienceId }) => ({ experience, experienceId }));

  let allExperiences = await getAllActiveSemesterValidExperiences(
    newFlightPlan.semestersFromGrad,
  );

  const nonSpecificExperiences = allExperiences.filter(
    (experience) =>
      experience.strengths.length == 0 && experience.majors.length == 0,
  );

  const finalNonSpecificExperiences = processNonSpecificExperiences(
    completedExperiences,
    nonSpecificExperiences,
    semestersFromGrad,
  );

  const specificExperiences = allExperiences.filter(
    (experience) =>
      experience.strengths.length > 0 || experience.majors.length > 0,
  );

  const finalSpecificExperiences = processSpecificExperiences(
    completedExperiences,
    specificExperiences,
    student,
    semestersFromGrad,
  );

  return [...finalNonSpecificExperiences, ...finalSpecificExperiences];
};

const getAllActiveSemesterValidExperiences = async (
  semestersFromGrad,
) => {
  const allExperiences = await Experience.findAll({
    include: [{ model: Strength }, { model: Major }],
    where: {
      semestersFromGrad: { [Op.gte]: semestersFromGrad },
      [Op.or]: [
        { semesterEnd: { [Op.lte]: semestersFromGrad } },
        { semesterEnd: null }
      ],
      status: "active", // <-- Only include active experiences
    },
  });

  return allExperiences.filter(
    (experience) => experience.semestersFromGrad >= semestersFromGrad && experience.status == "active",
  );
};

const processNonSpecificExperiences = (
  completedExperiences,
  nonSpecificExperiences,
  semestersFromGrad,
) => {
  const oneTimeExperiences = nonSpecificExperiences.filter(
    (experience) => experience.schedulingType === "one-time",
  );

  const completedExperienceIds = completedExperiences.map(
    ({ experienceId }) => experienceId,
  );

  const uncompletedOneTimeExperiences = oneTimeExperiences.filter(
    (experience) => !completedExperienceIds.includes(experience.id),
  );

  const everySemesterExperiences = nonSpecificExperiences.filter(
    (experience) => experience.schedulingType === "every-semester",
  );

  const everyOtherSemesterExperiences = nonSpecificExperiences.filter(
    (experience) => experience.schedulingType === "every-other-semester",
  );

  const uncompletedEveryOtherSemesterExperiences =
    processEveryOtherSemesterExperiences(
      completedExperiences,
      everyOtherSemesterExperiences,
      semestersFromGrad,
    );

  return [
    ...uncompletedOneTimeExperiences,
    ...everySemesterExperiences,
    ...uncompletedEveryOtherSemesterExperiences,
  ];
};

const processSpecificExperiences = (
  completedExperiences,
  specificExperiences,
  student,
  semestersFromGrad,
) => {
  const relevantSpecificExperiences = specificExperiences.filter(
    (experience) =>
      experience.strengths.some((strength) =>
        student.strengths.includes(strength),
      ) || experience.majors.some((major) => student.majors.includes(major)),
  );

  const oneTimeSpecificExperiences = relevantSpecificExperiences.filter(
    (experience) => experience.schedulingType === "one-time",
  );

  const completedExperienceIds = completedExperiences.map(
    ({ experienceId }) => experienceId,
  );

  const uncompletedOneTimeSpecificExperiences =
    oneTimeSpecificExperiences.filter(
      (experience) => !completedExperienceIds.includes(experience.id),
    );

  const everySemesterSpecificExperiences = relevantSpecificExperiences.filter(
    (experience) => experience.schedulingType === "every-semester",
  );

  const everyOtherSemesterSpecificExperiences =
    relevantSpecificExperiences.filter(
      (experience) => experience.schedulingType === "every-other-semester",
    );

  const uncompletedEveryOtherSemesterSpecificExperiences =
    processEveryOtherSemesterExperiences(
      completedExperiences,
      everyOtherSemesterSpecificExperiences,
      semestersFromGrad,
    );

  return [
    ...uncompletedOneTimeSpecificExperiences,
    ...everySemesterSpecificExperiences,
    ...uncompletedEveryOtherSemesterSpecificExperiences,
  ];
};

const processEveryOtherSemesterExperiences = (
  completedExperiences,
  experiences,
  semestersFromGrad,
) => {
  const isOddSemester = semestersFromGrad % 2 === 1;

  const relevantEveryOtherSemesterExperiences = experiences.filter(
    (experience) => {
      if (isOddSemester) {
        return experience.semestersFromGrad % 2 === 1;
      } else {
        return experience.semestersFromGrad % 2 === 0;
      }
    },
  );

  const uncompletedEveryOtherSemesterExperiences =
    relevantEveryOtherSemesterExperiences.filter((experience) => {
      const wasCompletedLastSemester = completedExperiences.some(
        (completedExperience) => {
          return (
            completedExperience.id === experience.id &&
            completedExperience.semestersFromGrad === semestersFromGrad + 1
          );
        },
      );

      if (wasCompletedLastSemester) {
        return false;
      }

      return true;
    });

  return uncompletedEveryOtherSemesterExperiences;
};
