// models/taskStrength.model.js

import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const TaskStrength = SequelizeInstance.define(
    "taskstrength",
    {
        taskId: {
            type: Sequelize.INTEGER,
            references: {
                model: "task",
                key: "id",
            },
        },
        strengthId: {
            type: Sequelize.INTEGER,
            references: {
                model: "strengths",
                key: "id",
            },
        },
    },
    {
        tableName: "TaskStrength",
    }
);

export default TaskStrength;