import fs from 'fs';


import { numFilesInsideData } from './saveFile';
export const deleteCSVFile = (fileId: string) => new Promise<{success: Boolean, error: null | String}>(async (resolve, reject) => {
   const fileNamesInData = await numFilesInsideData();
   const fileNameToDelete = fileNamesInData.filter(file => file.fileId === fileId)[0];
   fs.unlink('data/' + fileNameToDelete.fileName, (err) => {
       if(err) reject({success: false, error: err});
       resolve({success: true, error: null});
   })
})

