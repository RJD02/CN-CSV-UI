import { Request, Response } from "express";
import { deleteCSVFile } from "../utils/deleteCSVFile";

// uploadFile checks whether file sent is valid or not
export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No CSV file uploaded" });
  }
  return res.status(200).json({ message: "file uploaded successfully" });
};

// deleteFileHandler deletes a file with requested fileId from store as well as cache
export const deleteFileHandler = async (req: Request, res: Response) => {
  const fileId = req.params.id;
  try {
    const deleteData = await deleteCSVFile(fileId);
    if (deleteData.success) {
      return res.status(200).json({ message: "successfully deleted the file" });
    }
    return res.status(400).json({ message: deleteData.error });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
