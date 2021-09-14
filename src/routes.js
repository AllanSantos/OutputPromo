import { Router } from 'express';
import multer from 'multer';
import path from 'path'

// CONTROLLERS
import OutputPromoController from './app/controllers/OutputPromo';

// MIDDLEWARES
import multerConfig from "./app/middlewares/multer";
//const upload = multer({storage, fileFilter: csvFilter});

const routes = new Router();

routes.post('/json', multer(multerConfig).single('arquivoCSV'), OutputPromoController.store);
/* routes.post('/json', multer(multerConfig).single('arquivoCSV'), (req, res)=>{
  console.log(req.body, req.file)
  res.send('ok')
}); */

export default routes