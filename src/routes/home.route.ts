import express from 'express';
import { getHome, } from '../controllers/home.controller';

const homeRouter = express.Router();

// get home page
homeRouter.get('/', getHome);


export default homeRouter;
