import db from "../models/index.js";
import { Op } from "sequelize";
const Task = db.task;
const Experience = db.experience;
const Student = db.student;
const Major = db.major;
const FlightPlan = db.flightPlan;
const FlightPlanItem = db.flightPlanItem;

export const getFlightPlanItemsForNewFlightPlan = async (
  studentId,
  newFlightPlan,
) => {
  const student = await getStudentWithGenerationInfo(studentId);
  const completedItems = await getAllCompletedFlightPlanItemsForStudent(student);
  const incompletedItems = await getAllIncompletedFlightPlanItemsForStudent(student);
  const semestersFromGrad = newFlightPlan.semestersFromGrad;

  /* eslint-disable no-undef */
  const [taskItems, experienceItems] = await Promise.all([
    getTaskItems(completedItems, incompletedItems, student, semestersFromGrad),
    getExperienceItems(completedItems, incompletedItems, student, semestersFromGrad),
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
    include: [
      {
        model: Task,
        as: "task",
      },
      {
        model: Experience,
        as: "experience",
      },
    ],
  });

  return completedFlightPlanItems;
};

const getAllIncompletedFlightPlanItemsForStudent = async (student) => {
  const flightPlans = student.flightPlans
  const incompletedFlightPlanItems = await FlightPlanItem.findAll({
    where: {
      flightPlanId: {
        [Op.in]: flightPlans.map((flightPlan) => flightPlan.id),
      },
      status: "Incomplete",
    },
    include: [
      {
        model: Task,
        as: "task",
      },
      {
        model: Experience,
        as: "experience",
      },
      {
        model: FlightPlan,
        as: "flightPlan",
      },
    ],
  });

  return incompletedFlightPlanItems;
};

const getTaskItems = async (completedItems, incompletedItems, student, semestersFromGrad) => {
  const completedTasks = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Task")
    .map(({ taskId, task }) => ({ taskId, task }));

  const incompletedTasks = incompletedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Task")
    .map((flightPlanItem) => { return { task: flightPlanItem.task, semestersFromGrad: flightPlanItem.flightPlan.semestersFromGrad } });
  const allTasks = await getAllActiveSemesterValidTasks(
    semestersFromGrad,
  );

  // Filter tasks that aren't specific to a student's majors
  const nonSpecificTasks = allTasks.filter(
    (task) => task.majors.length == 0,
  );

  // Filter tasks that are specific to a student's majors
  const specificTasks = allTasks.filter(
    (task) => hasCommonMajor(student, task),
  );

  const relevantTasks = [...nonSpecificTasks, ...specificTasks];

  return processTasks(
    completedTasks,
    incompletedTasks,
    relevantTasks,
    semestersFromGrad,
  );
};

const getAllActiveSemesterValidTasks = async (semestersFromGrad) => {
  const allTasks = await Task.findAll({
    include: [{ model: Major }],
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

const processTasks = (
  completedTasks,
  incompletedTasks,
  tasks,
  semestersFromGrad,
) => {
  const oneTimeTasks = tasks.filter(
    (task) => task.schedulingType === "one-time",
  );

  const completedTaskIds = completedTasks.map(({ taskId }) => taskId);

  const uncompletedOneTimeTasks = oneTimeTasks.filter(
    (task) => !completedTaskIds.includes(task.id),
  );

  const everySemesterTasks = tasks.filter(
    (task) => task.schedulingType === "every-semester",
  );

  const everyOtherSemesterTasks = tasks.filter(
    (task) => task.schedulingType === "every-other-semester",
  );

  const uncompletedEveryOtherSemesterTasks = processEveryOtherSemesterTasks(
    incompletedTasks,
    everyOtherSemesterTasks,
    semestersFromGrad,
  );

  return [
    ...uncompletedOneTimeTasks,
    ...everySemesterTasks,
    ...uncompletedEveryOtherSemesterTasks,
  ];
};

const processEveryOtherSemesterTasks = (
  incompletedTasks,
  everyOtherTasks,
  semestersFromGrad,
) => {
  const isOddSemester = semestersFromGrad % 2 === 1;

  const relevantEveryOtherSemesterTasks =
    everyOtherTasks.filter(
      (task) => isOddSemester
        ? task.semestersFromGrad % 2 === 1
        : task.semestersFromGrad % 2 === 0
    );

  const relevantIncompletedTasks =
    incompletedTasks.filter(
      (task) =>
        task.task.schedulingType === "every-other-semester"
        && task.semestersFromGrad === semestersFromGrad + 1
        && !relevantEveryOtherSemesterTasks.some((activeTask) => task.task.id === activeTask.id)
    ).map((task) => task.task);

  const uncompletedEveryOtherSemesterTasks =
    relevantIncompletedTasks.filter(
      (incompletetask) =>
        everyOtherTasks.some(
          (activeTask) => activeTask.id === incompletetask.id
        )
    );

  return [...relevantEveryOtherSemesterTasks, ...uncompletedEveryOtherSemesterTasks];
};

const getExperienceItems = async (
  completedItems,
  incompletedItems,
  student,
  semestersFromGrad,
) => {
  const completedExperiences = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Experience")
    .map(({ experience, experienceId }) => ({ experience, experienceId }));

  const incompletedExperiences = incompletedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Experience")
    .map((flightPlanItem) => { return { experience: flightPlanItem.experience, semestersFromGrad: flightPlanItem.flightPlan.semestersFromGrad } });

  let allExperiences = await getAllActiveSemesterValidExperiences(
    semestersFromGrad,
  );

  const nonSpecificExperiences = allExperiences.filter(
    (experience) =>
      experience.majors.length == 0,
  );

  const specificExperiences = allExperiences.filter(
    (experience) => hasCommonMajor(student, experience),
  );

  const releventExperiences = [...nonSpecificExperiences, ...specificExperiences];

  return processExperiences(
    completedExperiences,
    incompletedExperiences,
    releventExperiences,
    semestersFromGrad,
  );
};

const getAllActiveSemesterValidExperiences = async (
  semestersFromGrad,
) => {
  const allExperiences = await Experience.findAll({
    include: [{ model: Major }],
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

const processExperiences = (
  completedExperiences,
  incompletedExperiences,
  experiences,
  semestersFromGrad,
) => {
  const oneTimeExperiences = experiences.filter(
    (experience) => experience.schedulingType === "one-time",
  );

  const completedExperienceIds = completedExperiences.map(
    ({ experienceId }) => experienceId,
  );

  const uncompletedOneTimeExperiences =
    oneTimeExperiences.filter(
      (experience) => !completedExperienceIds.includes(experience.id),
    );

  const everySemesterExperiences = experiences.filter(
    (experience) => experience.schedulingType === "every-semester",
  );

  const everyOtherSemesterExperiences =
    experiences.filter(
      (experience) => experience.schedulingType === "every-other-semester",
    );

  const uncompletedEveryOtherSemesterExperiences =
    processEveryOtherSemesterExperiences(
      incompletedExperiences,
      everyOtherSemesterExperiences,
      semestersFromGrad,
    );

  return [
    ...uncompletedOneTimeExperiences,
    ...everySemesterExperiences,
    ...uncompletedEveryOtherSemesterExperiences,
  ];
};

const processEveryOtherSemesterExperiences = (
  incompletedExperiences,
  everyOtherExperiences,
  semestersFromGrad,
) => {
  const isOddSemester = semestersFromGrad % 2 === 1;

  const relevantEveryOtherSemesterExperiences =
    everyOtherExperiences.filter(
      (experience) => isOddSemester
        ? experience.semestersFromGrad % 2 === 1
        : experience.semestersFromGrad % 2 === 0
    );

  const relevantIncompletedExperiences =
    incompletedExperiences.filter(
      (experience) =>
        experience.experience.schedulingType === "every-other-semester"
        && experience.semestersFromGrad === semestersFromGrad + 1
        && !relevantEveryOtherSemesterExperiences.some((activeExperience) => experience.experience.id === activeExperience.id)
    ).map((experience) => experience.experience);

  const uncompletedEveryOtherSemesterExperiences =
    relevantIncompletedExperiences.filter(
      (incompleteExperience) =>
        everyOtherExperiences.some(
          (activeExperience) => activeExperience.id === incompleteExperience.id
        )
    );

  return [...relevantEveryOtherSemesterExperiences, ...uncompletedEveryOtherSemesterExperiences];
};

const hasCommonMajor = (
  studentWithMajors,
  itemWithMajors,
) => {
  const hasCommonMajor = itemWithMajors.majors.some((itemMajor) =>
    studentWithMajors.majors.some(
      (studentMajor) => itemMajor.id === studentMajor.id,
    ),
  );
  return hasCommonMajor;
};