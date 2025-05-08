import db from "../models/index.js";
import FileHelpers from "../utilities/fileStorage.helper.js";
import sequelize from "../sequelizeUtils/sequelizeInstance.js";
const Submission = db.submission;
const FlightPlanItem = db.flightPlanItem;
const FlightPlan = db.flightPlan;
const Student = db.student;
const User = db.user;
const Notification = db.notification;

const exports = {};

exports.create = async (submissionData) => {
  const t = await sequelize.transaction();

  try {
    const submission = await Submission.create(submissionData, {
      transaction: t,
    });
    await FlightPlanItem.update(
      { status: "Pending" },
      { where: { id: submission.flightPlanItemId }, transaction: t },
    );

    const flightPlanItem = await FlightPlanItem.findOne({
      where: { id: submission.flightPlanItemId },
      transaction: t,
    });

    const student = await Student.findOne({
      include: [
        {
          model: FlightPlan,
          required: true,
          where: {
            id: flightPlanItem.flightPlanId,
          },
        },
        {
          model: User,
          as: "user",
        },
      ],
      transaction: t,
    });

    await Notification.create(
      {
        userId: student.user.id,
        header: "New submission for flight plan item",
        description:
          "You have been requested to review a new submission for a flight plan item",
      },
      { transaction: t },
    );
    await t.commit();
    return submission;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.bulkCreate = async (submissionData) => {
  const t = await sequelize.transaction();
  try {
    const submissions = await Submission.bulkCreate(submissionData, {
      transaction: t,
    });

    await FlightPlanItem.update(
      { status: "Pending" },
      { where: { id: submissionData[0].flightPlanItemId }, transaction: t },
    );

    const flightPlanItem = await FlightPlanItem.findOne({
      where: { id: submissionData[0].flightPlanItemId },
      transaction: t,
    });

    const student = await Student.findOne({
      include: [
        {
          model: FlightPlan,
          required: true,
          where: {
            id: flightPlanItem.flightPlanId,
          },
        },
        {
          model: User,
          as: "user",
        },
      ],
      transaction: t,
    });

    await Notification.create(
      {
        userId: student.user.id,
        header: "New submission for flight plan item",
        description:
          "You have been requested to review a new submission for a flight plan item",
      },
      { transaction: t },
    );
    await t.commit();
    return submissions;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.findAllForFlightPlanItem = async (flightPlanItemId) => {
  let submissions = await Submission.findAll({
    where: { flightPlanItemId },
  });

  submissions = getFilesForSubmissions(submissions);

  return { count: submissions.length, submissions };
};

exports.discardSubmissionForFlightPlanItem = async (flightPlanItemId) => {
  const submissions = await Submission.findAll({ where: { flightPlanItemId } });
  submissions.forEach((submission) => {
    if (submission.submissionType == "file") {
      FileHelpers.remove(submission.value);
    }
  });
  return await Submission.destroy({ where: { flightPlanItemId } });
};

const getFilesForSubmissions = (submissions) => {
  const response = submissions.map((submission) => {
    if (submission.submissionType == "file") {
      let fileName = submission.value;
      submission.value = FileHelpers.read(submission.value);
      return { ...submission.dataValues, fileName };
    }
    return submission;
  });

  return response;
};

export default exports;
