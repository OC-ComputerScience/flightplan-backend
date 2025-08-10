import cron from "node-cron";
import colleagueServices from "../services/colleagueClientServices.js";
import Student from "../sequelizeUtils/student.js"

const exports = {};

// Schedule tasks to be run on the server 12:01 am.
// From: https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples

exports.dailyTasks = () => {
  // for prod, runs every day at 11:59 pm.
  cron.schedule("59 23 * * *", async function () {
  // for testing, runs every minute
  // cron.schedule("* * * * *", async function () {
    console.log("Running daily tasks at 11:59 pm");
    updateCurrentStudents();
  });
};

// checks for updates for all current students (graduation date after today)
async function updateCurrentStudents() {
  let allCurrentStudents = await Student.findAllCurrentStudentsWithUserAndMajors();

  // Checks each student for updates
  allCurrentStudents.forEach(async (student) => {
    colleagueServices.checkUpdateStudentWithColleagueData(student);
  })
}

export default exports;
