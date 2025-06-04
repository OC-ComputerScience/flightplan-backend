// models/taskMajor.model.js

import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const TaskMajor = SequelizeInstance.define(
    "taskmajor",
    {
        taskId: {
            type: Sequelize.INTEGER,
            references: {
                model: "task",
                key: "id",
            },
        },
        majorId: {
            type: Sequelize.INTEGER,
            references: {
                model: "majors",
                key: "id",
            },
        },
    },
    {
        tableName: "TaskMajor",
    }
);

export default TaskMajor;