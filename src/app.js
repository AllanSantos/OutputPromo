import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
var timeout = require('connect-timeout');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes()
  }

  middlewares() {
    this.server.use(timeout(120000));
    this.server.use(haltOnTimedout);

    function haltOnTimedout(req, res, next){
      if (!req.timedout) next();
    }
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;