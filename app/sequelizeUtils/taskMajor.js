import db from "../models/index.js";
// Core Imports
import { Op } from "sequelize";

const TaskMajor = db.taskMajor;
const Task = db.task;
const Major = db.major; 
import FileHelpers from "../utilities/fileStorage.helper.js";
import sequelize from "../sequelizeUtils/sequelizeInstance.js";
// Module Exports Placeholder
const exports = {};