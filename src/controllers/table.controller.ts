import { Request, Response } from "express";
import { getFileData, updateNQueriedOnRequest } from "../utils/csvCaching";

export const getTableController = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 100;
   updateNQueriedOnRequest(fileId);

    const fileData = await getFileData(page, perPage, fileId);
    const remainingPages = Math.round( fileData.total / perPage)
    if(fileData.data.length === 0) return res.render("table", {data: [], title: "Out of bounds", headers: [], page: -1, remainingPages, perPage});
    const headers = Object.keys(fileData.data[0]);

    return res.render("table", { data: fileData.data, title: "File Detail", headers, page, remainingPages, perPage});

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


