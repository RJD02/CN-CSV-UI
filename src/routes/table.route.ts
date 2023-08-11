import express,  {Request, Response} from 'express'
import { getTableController } from '../controllers/table.controller';

const tableRouter = express.Router();

// get data for file with id
tableRouter.get('/:id', getTableController);

export default tableRouter;
