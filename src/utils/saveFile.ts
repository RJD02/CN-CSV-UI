import { Request } from "express";
import multer from "multer";
import { customAlphabet } from "nanoid";

const FILE_ID_SIZE = 20;

const ALPHABETS =
  "abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
const nanoid = customAlphabet(ALPHABETS, FILE_ID_SIZE);

// create a storage engine to store uploaded files in the 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data");
  },
  filename: (req, file, cb) => {
    const currDate = new Date();
    const month = currDate.getMonth() + 1;
    const year = currDate.getFullYear();
    const day = currDate.getDate();
    const fileName = `${nanoid()}-${day},${month},${year}-${file.originalname}`;
    console.log(fileName);
    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    // Accept the file if it's a csv
    cb(null, true);
  } else {
    // reject the file if it's not a csv
    console.log(file.mimetype);
    cb(new Error("Only CSV files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });

