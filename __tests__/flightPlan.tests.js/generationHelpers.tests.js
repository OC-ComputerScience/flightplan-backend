// flightPlan.test.js
import {
  getTasksForNewFlightPlan,
  getAllCompletedFlightPlanItemsForStudent,
  getOneTimeExperiences,
  getExperiencesForNewFlightPlan,
} from "../../app/utilities/flightPlanGeneration.helpers";

describe("getTasksForNewFlightPlan", () => {
  it("returns an empty array when allTasks is null", () => {
    const result = getTasksForNewFlightPlan([1, 2], null);
    expect(result).toEqual([]);
  });

  it("returns all tasks when completedTasks is null", () => {
    const allTasks = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = getTasksForNewFlightPlan(null, allTasks);
    expect(result).toEqual(allTasks);
  });

  it("returns all tasks when completedTasks is an empty array", () => {
    const allTasks = [{ id: 1 }, { id: 2 }];
    const result = getTasksForNewFlightPlan([], allTasks);
    expect(result).toEqual(allTasks);
  });

  it("filters out completed tasks from allTasks", () => {
    const completedTasks = [1, 3];
    const allTasks = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const expected = [{ id: 2 }, { id: 4 }];

    const result = getTasksForNewFlightPlan(completedTasks, allTasks);
    expect(result).toEqual(expected);
  });

  it("returns an empty array when all tasks are completed", () => {
    const completedTasks = [1, 2];
    const allTasks = [{ id: 1 }, { id: 2 }];

    const result = getTasksForNewFlightPlan(completedTasks, allTasks);
    expect(result).toEqual([]);
  });

  it("returns original allTasks if completedTasks contains no matching IDs", () => {
    const completedTasks = [99, 100];
    const allTasks = [{ id: 1 }, { id: 2 }];

    const result = getTasksForNewFlightPlan(completedTasks, allTasks);
    expect(result).toEqual(allTasks);
  });
});

describe("getAllCompletedFlightPlanItemsForStudent", () => {
  it("returns all completed flight plan items for a student", () => {
    const student = {
      flightPlans: [
        {
          flightPlanItems: [
            { id: 1, status: "Complete" },
            { id: 2, status: "In Progress" },
          ],
        },
        {
          flightPlanItems: [
            { id: 3, status: "Complete" },
            { id: 4, status: "Pending" },
          ],
        },
      ],
    };

    const result = getAllCompletedFlightPlanItemsForStudent(student);
    expect(result).toEqual([
      { id: 1, status: "Complete" },
      { id: 3, status: "Complete" },
    ]);
  });

  it("returns only valid completed items and skips flight plans with undefined flightPlanItems", () => {
    const student = {
      flightPlans: [
        {
          flightPlanItems: [
            { id: 1, status: "Complete" },
            { id: 2, status: "In Progress" },
          ],
        },
        {
          // Missing flightPlanItems here
        },
        {
          flightPlanItems: [{ id: 3, status: "Complete" }],
        },
      ],
    };

    const result = getAllCompletedFlightPlanItemsForStudent(student);
    expect(result).toEqual([
      { id: 1, status: "Complete" },
      { id: 3, status: "Complete" },
    ]);
  });

  it("returns an empty array if student has no flight plans", () => {
    const student = {
      flightPlans: [],
    };

    const result = getAllCompletedFlightPlanItemsForStudent(student);
    expect(result).toEqual([]);
  });

  it("returns an empty array if flight plans have no items", () => {
    const student = {
      flightPlans: [{ flightPlanItems: [] }, { flightPlanItems: [] }],
    };

    const result = getAllCompletedFlightPlanItemsForStudent(student);
    expect(result).toEqual([]);
  });

  it("returns an empty array if no items are completed", () => {
    const student = {
      flightPlans: [
        {
          flightPlanItems: [
            { id: 1, status: "In Progress" },
            { id: 2, status: "Not Started" },
          ],
        },
      ],
    };

    const result = getAllCompletedFlightPlanItemsForStudent(student);
    expect(result).toEqual([]);
  });

  it("returns an empty array if student.flightPlans is undefined", () => {
    const student = {};

    const result = getAllCompletedFlightPlanItemsForStudent(student);
    expect(result).toEqual([]);
  });
});

describe("getOneTimeExperiences", () => {
  it("returns an empty array when allOneTimeExperiences is null", () => {
    const result = getOneTimeExperiences([1, 2], null);
    expect(result).toEqual([]);
  });

  it("returns all experiences when completedExperienceIds is null", () => {
    const experiences = [{ id: 1 }, { id: 2 }];
    const result = getOneTimeExperiences(null, experiences);
    expect(result).toEqual(experiences);
  });

  it("returns all experiences when completedExperienceIds is an empty array", () => {
    const experiences = [{ id: 1 }, { id: 2 }];
    const result = getOneTimeExperiences([], experiences);
    expect(result).toEqual(experiences);
  });

  it("filters out completed experiences correctly", () => {
    const completed = [1, 3];
    const all = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const expected = [{ id: 2 }, { id: 4 }];

    const result = getOneTimeExperiences(completed, all);
    expect(result).toEqual(expected);
  });

  it("returns an empty array if all experiences are completed", () => {
    const completed = [1, 2];
    const all = [{ id: 1 }, { id: 2 }];
    const result = getOneTimeExperiences(completed, all);
    expect(result).toEqual([]);
  });

  it("returns original list if no completed IDs match", () => {
    const completed = [99, 100];
    const all = [{ id: 1 }, { id: 2 }];
    const result = getOneTimeExperiences(completed, all);
    expect(result).toEqual(all);
  });
});

describe("getExperiencesForNewFlightPlan", () => {
  it("returns only every-semester experiences when one-time is empty", () => {
    const result = getExperiencesForNewFlightPlan(
      [1, 2],
      [],
      [{ id: "sem-1" }, { id: "sem-2" }],
    );

    expect(result).toEqual([{ id: "sem-1" }, { id: "sem-2" }]);
  });

  it("returns combined one-time and every-semester experiences", () => {
    const result = getExperiencesForNewFlightPlan(
      [],
      [{ id: "one-1" }, { id: "one-2" }],
      [{ id: "sem-1" }],
    );

    expect(result).toEqual([{ id: "one-1" }, { id: "one-2" }, { id: "sem-1" }]);
  });

  it("returns only one-time experiences when every-semester is empty", () => {
    const result = getExperiencesForNewFlightPlan([], [{ id: "one-1" }], []);

    expect(result).toEqual([{ id: "one-1" }]);
  });

  it("returns empty array if both experience types are empty", () => {
    const result = getExperiencesForNewFlightPlan([], [], []);

    expect(result).toEqual([]);
  });

  it("passes the correct arguments to getOneTimeExperiences", () => {
    const completed = [1];
    const oneTime = [{ id: 1 }, { id: 2 }];
    const everySemester = [{ id: 3 }];

    const result = getExperiencesForNewFlightPlan(
      completed,
      oneTime,
      everySemester,
    );

    expect(result).toEqual([{ id: 2 }, { id: 3 }]);
  });
});
