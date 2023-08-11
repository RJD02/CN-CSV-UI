import { Request, Response } from "express";
import { getFileData, updateNQueriedOnRequest } from "../utils/csvCaching";

export const getTableController = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const page = Number(req.query.page) || 1;
    let perPage = Number(req.query.perPage) || 100;
    const validPerPages = [100, 150, 200, 250, 300];
    if (!validPerPages.includes(perPage)) perPage = 100;
    updateNQueriedOnRequest(fileId);

    const fileData = await getFileData(page, perPage, fileId);
    let remainingPages = 0;
    if (perPage > fileData.total && fileData.data.length > 0)
      remainingPages = 1;
    else remainingPages = Math.round(fileData.total / perPage);
    if (fileData.data.length === 0)
      return res.render("table", {
        data: [],
        title: "Out of bounds",
        headers: [],
        page: -1,
        remainingPages,
        perPage,
      });
    const headers = Object.keys(fileData.data[0]);

    return res.render("table", {
      data: fileData.data,
      title: "File Detail",
      headers,
      page,
      remainingPages,
      perPage,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
