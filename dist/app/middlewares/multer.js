"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
const path = require("path");

const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};

const storage = _multer2.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../../src/files/'))
  },
  filename: (req, file, cb) => {
    cb(null, 'upload.csv')
  },
})

module.exports = {
  storage: storage,
  fileFilter: csvFilter
};