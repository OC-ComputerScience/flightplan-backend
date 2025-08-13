import Badge from "../sequelizeUtils/badge.js";

const exports = {};

exports.create = async (req, res) => {
  await Badge.create(req.body)
    .then((data) => {
     
      res.send(data);
    })
    .catch((err) => {
      console.error("Error creating badge:", err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the badge.",
      });
    });
};

exports.findOne = async (req, res) => {
  try {
    const badge = await Badge.findOne(req.params.id);
    if (badge) {
      res.json(badge);
    } else {
      res.status(404).json({
        message: `Cannot find badge with id = ${req.params.id}.`,
      });
    }
  } catch (err) {
    console.error("Error retrieving badge:", err);
    res.status(500).json({
      message: "Error retrieving badge with id = " + req.params.id,
    });
  }
};

exports.findAllBadgesForStudent = async (req, res) => {
  await Badge.findAllBadgesForStudent(
    req.params.id,
    req.query.page,
    req.query.pageSize,
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error fetching badges for student:", err);
      res.status(500).json({
        message: "Error retrieving badges for student",
        error: err.message,
      });
    });
};

exports.findAllActiveBadges = async (req, res) => {
  await Badge.findAllActiveBadges(
    req.query.page,
    req.query.pageSize,
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error fetching active badges:", err);
      res.status(500).json({
        message: "Error retrieving active badges",
        error: err.message,
      });
    });
};

exports.findAllInactiveBadges = async (req, res) => {
  await Badge.findAllInactiveBadges(
    req.query.page,
    req.query.pageSize,
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error fetching inactive badges:", err);
      res.status(500).json({
        message: "Error retrieving inactive badges",
        error: err.message,
      });
    });
};

exports.findAll = async (req, res) => {
  await Badge.findAllBadges(
    req.query.page,
    req.query.pageSize,
    req.query.searchQuery,
    {
      status: req.query.status,
      ruleType: req.query.ruleType,
      sortAttribute: req.query.sortAttribute,
      sortDirection: req.query.sortDirection
    }
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error fetching badges:", err);
      res.status(500).json({
        message: "Error retrieving badges",
        error: err.message,
      });
    });
};

exports.getRuleTypes = async (req, res) => {
  res.send(Badge.getRuleTypes());
};

exports.getStatusTypes = async (req, res) => {
  res.send(Badge.getStatusTypes());
};

exports.getUnviewedBadges = async (req, res) => {
  await Badge.getUnviewedBadges(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error fetching unviewed badges:", err);
      res.status(500).json({
        message: "Error retrieving unviewed badges",
        error: err.message,
      });
    });
};

exports.viewBadge = async (req, res) => {
  await Badge.viewBadge(req.params.id).then((data) => {
    res.send(data);
  });
};

exports.update = async (req, res) => {
  try {
    const updated = await Badge.update(req.body, req.params.id);
    res.json(updated);
  } catch (err) {
    console.error("Error updating badge:", err);
    res.status(500).json({
      message: "Error updating badge",
      error: err.message,
    });
  }
};

export default exports;
