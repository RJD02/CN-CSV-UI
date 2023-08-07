import { Request, Response } from "express";
import fs from "fs";
import { getFileData } from "../utils/csvCaching";
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
    const fileName = `${nanoid()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "text/csv" || file.mimetype === 'application/vnd.ms-excel') {
    // Accept the file if it's a csv
    cb(null, true);
  } else {
    // reject the file if it's not a csv
    console.log(file.mimetype);
    cb(new Error("Only CSV files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });

const numFilesInsideData = () =>
  new Promise<string[]>((resolve, reject) => {
    fs.readdir("./data", (err, files) => {
      if (err) reject(err);
      const fileNames = files.map((file) =>
        file.split("-").length > 1 ? file.split("-").slice(1).join("-") : file
      );
      resolve(fileNames);
    });
  });

export const getHome = async (req: Request, res: Response) => {
  const files = await numFilesInsideData();
  const fileData = await getFileData(1, 10, "./data/flight-cutomer.csv");
  console.log(files);
  return res.render("home", { data: fileData, files, title: "Homepage" });
};

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No CSV file uploaded" });
  }
  return res.status(200).json({message: "file uploaded successfully"});
};
