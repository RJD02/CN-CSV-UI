import { Request, Response } from "express";
import { deleteCSVFile } from "../utils/deleteCSVFile";

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No CSV file uploaded" });
  }
  return res.status(200).json({ message: "file uploaded successfully" });
};
export const deleteFileHandler = async (req: Request, res: Response) => {
    const fileId = req.params.id;
    const deleteData = await deleteCSVFile(fileId);
    if(deleteData.success) {
        return res.status(200).json({message: "successfully deleted the file"});
    }
    return res.status(400).json({message: deleteData.error});
}
