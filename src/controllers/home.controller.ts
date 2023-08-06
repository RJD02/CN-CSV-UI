import { Request, Response } from "express";
import fs from "fs";
import { getFileData } from "../utils/csvCaching";

const numFilesInsideData = () =>
  new Promise<number>((resolve, reject) => {
    fs.readdir("./data", (err, files) => {
      if (err) reject(err);
      resolve(files.length);
    });
  });

export const getHome = async (req: Request, res: Response) => {
  const files = await numFilesInsideData();
  const fileData = await getFileData(1, 10, "./data/sample.csv");
  res.status(200).json({ data: fileData, message: "hello world", files });
};
