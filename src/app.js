import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import sslRedirect from 'heroku-ssl-redirect'

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes()
  }

  middlewares() {
    this.server.use(sslRedirect())
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;