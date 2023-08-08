import express,  {Request, Response} from 'express'
import { getTableController } from '../controllers/table.controller';

const tableRouter = express.Router();

tableRouter.get('/:id', getTableController);

export default tableRouter;
