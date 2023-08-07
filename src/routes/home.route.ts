import express from 'express';
import { getHome, upload, uploadFile } from '../controllers/home.controller';

const homeRouter = express.Router();

homeRouter.get('/', getHome);

homeRouter.post('/upload', upload.single("csvFile"), uploadFile);

export default homeRouter;
