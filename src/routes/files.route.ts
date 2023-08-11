import express, { Request, Response } from "express";
import { deleteFileHandler, uploadFile } from "../controllers/files.controller";
import { upload } from "../utils/saveFile";
const fileRouter = express.Router();

// handle upload with multer
fileRouter.post("/upload", upload.single("csvFile"), uploadFile);

// handle delete file
fileRouter.delete("/:id", deleteFileHandler);

export default fileRouter;
