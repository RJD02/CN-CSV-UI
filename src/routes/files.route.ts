import express, { Request, Response } from "express";
import { deleteFileHandler, uploadFile } from "../controllers/files.controller";
import { upload } from "../utils/saveFile";
const fileRouter = express.Router();

fileRouter.post('/upload', upload.single("csvFile"), uploadFile);

fileRouter.delete('/:id', deleteFileHandler);

export default fileRouter;
