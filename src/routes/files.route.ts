import express, { Request, Response } from "express";
import { uploadFile } from "../controllers/files.controller";
import { upload } from "../utils/saveFile";
const fileRouter = express.Router();

fileRouter.post('/upload', upload.single("csvFile"), uploadFile);


export default fileRouter;
