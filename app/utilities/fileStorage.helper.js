import multer from "multer";
import path from "path";
import fs from "fs";
import util from "util";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const maxSize = 2 * 1024 * 1024;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, "../..");
const uploadDir = path.join(baseDir, "uploads");

// Ensure base upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed file MIME types
const allowedMimeTypes = {
  "image/jpeg": "photos",
  "image/png": "photos",
  "image/gif": "photos",
  "application/pdf": "documents",
  "application/msword": "documents",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "documents",
  "text/plain": "documents",
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subDir = "photos";

    if (req.query.folder === "submissions") {
      subDir = "submissions";
    }

    const finalPath = path.join(uploadDir, subDir);

    if (!fs.existsSync(finalPath)) {
      // Make directory if it doesn't exist
      fs.mkdirSync(finalPath, { recursive: true });
    }

    cb(null, finalPath);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);

    const uniqueFilename = `${uuidv4()}-${Date.now()}${fileExt}`;

    req.savedFileName = uniqueFilename;

    cb(null, uniqueFilename);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"), false);
    }
  },
}).single("file");

let removeFile = (fileName) => {
  const directories = ["photos", "submissions"];

  for (const folder of directories) {
    const filePath = path.join(uploadDir, folder, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return; // Stop once the file is deleted
    }
  }
};

let readFile = (fileName) => {
  const directories = ["photos", "submissions"];

  for (const folder of directories) {
    const filePath = path.join(uploadDir, folder, fileName);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = mime.lookup(filePath) || "application/octet-stream"; // Default if not recognized
      return { data: fileBuffer, mimeType };
    }
  }

  return null; // Return null if the file is not found
};

const exportFunctions = {
  upload: util.promisify(uploadFile),
  remove: removeFile,
  read: readFile,
};

export default exportFunctions;
