import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';
import { FILE_PATH } from './global/environment';
const fs = require('fs');
require('log-timestamp');

// https://scotch.io/tutorials/nodejs-cron-jobs-by-examples

const server = Server.instance;

// BodyParser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// CORS
server.app.use(cors({ origin: true, credentials: true }));

// Routes
server.app.use('/', router);
fs.watchFile(FILE_PATH, (_: any, __: any) => {
    console.log(`${FILE_PATH} file Changed`);
    server.update();
});

server.start(() => {
    console.log(`Server start in ${server.port}`);
});

