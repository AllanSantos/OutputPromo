"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

// CONTROLLERS
var _OutputPromo = require('./app/controllers/OutputPromo'); var _OutputPromo2 = _interopRequireDefault(_OutputPromo);

// MIDDLEWARES
var _multer3 = require('./app/middlewares/multer'); var _multer4 = _interopRequireDefault(_multer3);
//const upload = multer({storage, fileFilter: csvFilter});

const routes = new (0, _express.Router)();

routes.post('/json', _multer2.default.call(void 0, _multer4.default).single('arquivoCSV'), _OutputPromo2.default.store);
/* routes.post('/json', multer(multerConfig).single('arquivoCSV'), (req, res)=>{
  console.log(req.body, req.file)
  res.send('ok')
}); */

exports. default = routes