import FlightPlanItem from "../sequelizeUtils/flightPlanItem.js";

const validateFlightPlanItem = (flightPlanItem) => {
  const hasTask =
    flightPlanItem.taskId !== undefined && flightPlanItem.taskId !== null;
  const hasEvent =
    flightPlanItem.eventId !== undefined && flightPlanItem.eventId !== null;
  const hasExperience =
    flightPlanItem.experienceId !== undefined &&
    flightPlanItem.experienceId !== null;
  const hasFlightPlan =
    flightPlanItem.flightPlanId !== undefined &&
    flightPlanItem.flightPlanId !== null;

  // Rule 1: FlightPlanItem must have a flightPlanId
  if (!hasFlightPlan) {
    throw new Error("A FlightPlanItem must have a flightPlanId.");
  }

  // Rule 2: FlightPlanItem must have either an experienceId or a taskId
  if (!hasExperience && !hasTask) {
    throw new Error(
      "A FlightPlanItem must have at least an experienceId or a taskId.",
    );
  }

  // Rule 3: Only FlightPlanItems with an experienceId can have an eventId
  if (hasEvent && !hasExperience) {
    throw new Error(
      "A FlightPlanItem can only have an eventId if it has an experienceId.",
    );
  }

  // Rule 4: A FlightPlanItem cannot have both taskId and experienceId set to null
  if (flightPlanItem.taskId === null && flightPlanItem.experienceId === null) {
    throw new Error(
      "A FlightPlanItem cannot have both taskId and experienceId set to null.",
    );
  }

  // Rule 5: A FlightPlanItem cannot have both taskId and experienceId set
  if (hasTask && hasExperience) {
    throw new Error(
      "A FlightPlanItem cannot have both taskId and experienceId set.",
    );
  }
};

const exports = {};

exports.create = async (req, res) => {
  try {
    validateFlightPlanItem(req.body); // Validate the incoming data
    const data = await FlightPlanItem.createFlightPlanItem(req.body);
    res.send(data);
  } catch (err) {
    res.status(400).send({
      message:
        err.message || "Some error occurred while creating the flightPlanItem.",
    });
  }
};

exports.createSubmission = async (req, res) => {
  await FlightPlanItem.createSubmission(req.params.flightPlanItemId, req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error creating submission for flightPlanItem with id = " +
          req.params.flightPlanItemId,
      });
      console.log(err);
    });
};

exports.findOne = async (req, res) => {
  await FlightPlanItem.findOneFlightPlanItem(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find flightPlanItem with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving flightPlanItem with id = " + req.params.id,
      });
      console.log("Could not find flightPlanItem: " + err);
    });
};

exports.findAll = async (req, res) => {
  await FlightPlanItem.findAllFlightPlanItems(
    req.query.page,
    req.query.pageSize,
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving flightPlanItems.",
      });
    });
};

exports.findAllFlightPlanItemsByFlightPlanId = async (req, res) => {
  const flightPlanId = req.params.flightPlanId;
  const {
    page,
    pageSize,
    searchQuery,
    status,
    flightPlanItemType,
    sortAttribute,
    sortDirection,
  } = req.query;

  await FlightPlanItem.findAllFlightPlanItemsByFlightPlanId(
    flightPlanId,
    page,
    pageSize,
    searchQuery,
    { status, flightPlanItemType, sortAttribute, sortDirection },
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error retrieving flightPlanItems for flightPlanId = " + flightPlanId,
      });
      console.log("Could not retrieve flightPlanItems: " + err);
    });
};

exports.getPendingApprovals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.searchQuery || "";

    const response = await FlightPlanItem.getPendingApprovals(
      page,
      pageSize,
      searchQuery,
    );
    res.send(response);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving pending approvals.",
    });
    console.log("Error retrieving pending approvals: " + err);
  }
};

exports.getFlightPlanItemTypes = (req, res) => {
  const response = FlightPlanItem.getFlightPlanItemTypes();
  res.send(response);
};

exports.getFlightPlanItemStatuses = (req, res) => {
  const response = FlightPlanItem.getFlightPlanItemStatuses();
  res.send(response);
};

exports.update = async (req, res) => {
  try {
   
    const flightPlanItem = await FlightPlanItem.findOneFlightPlanItem(
      req.params.id,
      null,
    );

    req.body.experienceId =
      req.body.experienceId !== undefined
        ? req.body.experienceId
        : flightPlanItem.experienceId;
    req.body.taskId =
      req.body.taskId !== undefined ? req.body.taskId : flightPlanItem.taskId;
    req.body.flightPlanId =
      req.body.flightPlanId !== undefined
        ? req.body.flightPlanId
        : flightPlanItem.flightPlanId;
    req.body.eventId =
      req.body.eventId !== undefined
        ? req.body.eventId
        : flightPlanItem.eventId;
  

    // Validate the modified req.body
    validateFlightPlanItem(req.body); // Validate the incoming data, mark as update
    const num = await FlightPlanItem.updateFlightPlanItem(
      req.body,
      req.params.id,
    );
    if (num == 1) {
      res.send({
        message: "FlightPlanItem was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update flightPlanItem with id = ${req.params.id}. Maybe flightPlanItem was not found or req.body was empty!`,
      });
    }
  } catch (err) {
    res.status(400).send({
      message: err.message || "Error updating flightPlanItem.",
    });
  }
};

exports.approveFlightPlanItem = async (req, res) => {
  try {
    const response = await FlightPlanItem.approveFlightPlanItem(req.params.id);

    // const flightPlanItem = await FlightPlanItem.findOneFlightPlanItem(
    //   req.params.id,
    // );

    // if (flightPlanItem) {
    //   const deviceTokens = [
    //     'egbNnTzBSHiW3AOGwoCAMT:APA91bFyBYDbS3OJrQqE3gZ_tJjmzC_WYBk3sA1Yj7EOv3ps-uNTKbZjNK54WRyj0x6bbGRyUzN1iCC-As-G0NtM_DB7eZyGOAtWM33g_xgcQlgJb695g2s', // Griffin
    //     'eor_5zpyTq6gu8JoYH0FyI:APA91bFkt0HCxN7hItI0eLBEjJW1PKjxttxhuCG7lyhvfgGgqoXbKN-GrjQbJRPerWNRi8z0U-0nEMFdhJonTpbF7QRG6yifSdTCu9SaWuRiktVWrE0szvA' // Booker
    //   ];

    //   for (const token of deviceTokens) {
    //     await MobileNotification.sendMobileNotification(token,
    //       'Task Approved',
    //       `Your Flight Plan item (${flightPlanItem.name}) has been approved`
    //     );
    //   }
    // }

    res.send(response);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while approving the flight plan item.",
    });
    console.log("Error approving flight plan item: " + err);
  }
};

exports.rejectFlightPlanItem = async (req, res) => {
  try {
    const response = await FlightPlanItem.rejectFlightPlanItem(req.params.id);
    res.send(response);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while rejecting the flight plan item.",
    });
    console.log("Error rejecting flight plan item: " + err);
  }
};

exports.delete = async (req, res) => {
  await FlightPlanItem.deleteFlightPlanItem(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "FlightPlanItem was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete flightPlanItem with id = ${req.params.id}. Maybe flightPlanItem was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete flightPlanItem with id = " + req.params.id,
      });
      console.log("Could not delete flightPlanItem: " + err);
    });
};

exports.getFlightPlanItemsWithEventsForStudent = async (req, res) => {
  try {
    const { studentId, flightPlanId } = req.params;
    const items = await FlightPlanItem.getFlightPlanItemsWithEventsForStudent(
      studentId,
      flightPlanId,
    );
    res.send(items);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export default exports;
