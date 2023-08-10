import Cache, { CacheItem } from "./caching";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

const MAX_FILE_CACHE = 10;

const fileCache = new Cache(MAX_FILE_CACHE);

export const getFileId = (fileName: string) => {
  return fileName.split("-")[0];
};

export interface PromiseResult {
  success: Boolean;
  message: string;
  data?: any;
}
export const extractFileDetails = (file: string): IDataFileDetails => {
  const fileSplitArr = file.split("-");
  const name = fileSplitArr.length > 1 ? fileSplitArr.slice(2).join("-") : file;
  const queried = getTimesQueriedFile(file.split('-')[0]);
  const fileId = getFileId(file);
  const fileCreatedDate = fileSplitArr[1].split(",");
  const createdAt = fileCreatedDate.join("-");
  return {
    name,
    queried,
    fileId,
    createdAt,
    fileName: file,
  };
};

export interface IDataFileDetails {
  name: string;
  queried: number;
  fileId: string;
  createdAt: string;
  fileName: string;
}

export const numFilesInsideData = () =>
  new Promise<IDataFileDetails[]>((resolve, reject) => {
    fs.readdir("./data", (err, files) => {
      if (err) reject(err);
      const fileNames = files.map(extractFileDetails);
      resolve(fileNames);
    });
  });

const getFileNameFromId = async (fileId: string) => {
  try {
    const files = await numFilesInsideData();
    const file = files.filter((f) => f.fileId === fileId)[0];
    if (file) {
      return file.fileName;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};


const loadFileIntoCache = (fileId: string) =>
  new Promise<PromiseResult>(async (resolve, reject) => {
    try {
        console.log('Loading ', fileId, 'into cache');
      const results: any = [];
      const fileName = await getFileNameFromId(fileId);
      if (!fileName) throw Error("File not found");
      fs.createReadStream("./data/" + fileName)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          const fileId = getFileId(fileName);
          fileCache.set(fileId, results);
          resolve({ success: true, data: results, message: "" });
        })
        .on("error", (e) => reject({ success: false, message: e }));
    } catch (e) {
      return reject({ message: e, success: false });
    }
  });


export const getFileData = async (
  page: number,
  perPage: number,
  fileId: string
): Promise<{}[]> => {
  try {
    const fileData = fileCache.get(fileId);
    if (fileData) {
      const startRow = (page - 1) * perPage;
      const endRow = startRow + perPage;
      return fileData.slice(startRow, Math.min(endRow, fileData.length));
    }
    const response = await loadFileIntoCache(fileId);
    if (response.success) return await getFileData(page, perPage, fileId);
  } catch (e) {
    console.log(e);
  }
  return [];
};

export const getTimesQueriedFiles = (files: string[]) => {
  return files.map((file) => {
    return {
      file,
      queried: fileCache.getQueried(file),
    };
  });
};

export const printFileCache = () => {
  console.log(fileCache);
};

export const getTimesQueriedFile = (file: string) => {
  return fileCache.getQueried(file);
};

export const removeFileFromCache = (fileId: string) => {
  fileCache.delete(fileId);
};
export const updateNQueriedOnRequest = (fileId: string) => {
    fileCache.increaseQuery(fileId);
}
