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

  // Filter tasks that aren't specific to a student's strengths or majors
  const nonSpecificTasks = allTasks.filter(
    (task) => task.strengths.length == 0 && task.majors.length == 0,
  );

  const finalNonSpecificTasks = processNonSpecificTasks(
    completedTasks,
    incompletedTasks,
    nonSpecificTasks,
    semestersFromGrad,
  );

  // Filter tasks that are specific to a student's strengths or majors
  const specificTasks = allTasks.filter(
    (task) => hasCommonStrengthOrMajor(student, task),
  );

  const finalSpecificTasks = processSpecificTasks(
    completedTasks,
    incompletedTasks,
    specificTasks,
    semestersFromGrad,
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
  incompletedTasks,
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

const processSpecificTasks = (
  completedTasks,
  incompletedTasks,
  specificTasks,
  semestersFromGrad,
) => {
  const oneTimeSpecificTasks = specificTasks.filter(
    (task) => task.schedulingType === "one-time",
  );

  const completedTaskIds = completedTasks.map(({ taskId }) => taskId);

  const uncompletedOneTimeSpecificTasks = oneTimeSpecificTasks.filter(
    (task) => !completedTaskIds.includes(task.id),
  );

  const everySemesterSpecificTasks = specificTasks.filter(
    (task) => task.schedulingType === "every-semester",
  );

  const everyOtherSemesterSpecificTasks = specificTasks.filter(
    (task) => task.schedulingType === "every-other-semester",
  );

  const uncompletedEveryOtherSemesterSpecificTasks =
    processEveryOtherSemesterTasks(
      incompletedTasks,
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
      experience.strengths.length == 0 && experience.majors.length == 0,
  );

  const finalNonSpecificExperiences = processNonSpecificExperiences(
    completedExperiences,
    incompletedExperiences,
    nonSpecificExperiences,
    semestersFromGrad,
  );

  const specificExperiences = allExperiences.filter(
    (experience) => hasCommonStrengthOrMajor(student, experience),
  );

  const finalSpecificExperiences = processSpecificExperiences(
    completedExperiences,
    incompletedExperiences,
    specificExperiences,
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
  incompletedExperiences,
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

const processSpecificExperiences = (
  completedExperiences,
  incompletedExperiences,
  specificExperiences,
  semestersFromGrad,
) => {
  const oneTimeSpecificExperiences = specificExperiences.filter(
    (experience) => experience.schedulingType === "one-time",
  );

  const completedExperienceIds = completedExperiences.map(
    ({ experienceId }) => experienceId,
  );

  const uncompletedOneTimeSpecificExperiences =
    oneTimeSpecificExperiences.filter(
      (experience) => !completedExperienceIds.includes(experience.id),
    );

  const everySemesterSpecificExperiences = specificExperiences.filter(
    (experience) => experience.schedulingType === "every-semester",
  );

  const everyOtherSemesterSpecificExperiences =
    specificExperiences.filter(
      (experience) => experience.schedulingType === "every-other-semester",
    );

  const uncompletedEveryOtherSemesterSpecificExperiences =
    processEveryOtherSemesterExperiences(
      incompletedExperiences,
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

const hasCommonStrengthOrMajor = (
  studentWithStrengthsAndMajors,
  itemWithStrengthsAndMajors,
) => {
  const hasCommonStrength = itemWithStrengthsAndMajors.strengths.some((itemStrength) =>
    studentWithStrengthsAndMajors.strengths.some(
      (studentStrength) => itemStrength.id === studentStrength.id,
    ),
  );
  const hasCommonMajor = itemWithStrengthsAndMajors.majors.some((itemMajor) =>
    studentWithStrengthsAndMajors.majors.some(
      (studentMajor) => itemMajor.id === studentMajor.id,
    ),
  );
  return hasCommonStrength || hasCommonMajor;
};