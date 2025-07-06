import cron from "node-cron";
import Event from "../sequelizeUtils/event.js";

const exports = {};

// Schedule tasks to be run on the server 12:01 am.
// From: https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples

exports.hourlyTasks =  () => {
  // for prod, runs at ever hour at 05 minute past the hour.
  cron.schedule("05 * * * *", async function () {
    // for testing, runs every minute
  //   cron.schedule("* * * * *", async function () {
    console.log("Every Hourly Taks:");
    await checkForPastEvents();
  
  });
};


// this gets appointments around 2 hours from now
async function checkForPastEvents() {
  let pastEvents = [];

  await Event.findPastEventsWithUpcoming()
    .then((data) => {
      pastEvents = data;
    })
    .catch((err) => {
      console.log("Could not find past appointments to notify: " + err);
    });

  for (let i = 0; i < pastEvents.length; i++) {
    let event = pastEvents[i].dataValues;
    event.status = "Past";
    await Event.updateEvent(event,event.id );
  }
    
}

export default exports;
    