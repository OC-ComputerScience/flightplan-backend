import Template from "../sequelizeUtils/template.js";

const exports = {};

exports.findOne = async (req, res) => {
  await Template.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occured while trying to retrieve template with id of ${req.params.id}`,
      });
    });
};

export default exports;
