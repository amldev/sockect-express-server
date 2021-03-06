import { SERVER_PORT } from './../global/environment';

import express from 'express';

import socketIO from 'socket.io';

import http from 'http';

export default class Server {

    private static _instance: Server;
    public io: socketIO.Server

    public app: express.Application;
    public port: number;
    private httpServer: any;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server(this.app);

        this.io = socketIO(this.httpServer);

        this.listenSockets();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private listenSockets() {
        console.log('Listen connections - sockets');

        this.io.on('connection', client => {
            console.log('New client connect', client);
        })
    }

    start(callback: Function) {
        this.update();
        this.httpServer.listen(this.port, callback);
    }
// http://127.0.0.1:8000/api/stays/add/clients

    update() {
        const DEV = 'http://127.0.0.1:8000/api/stays/add/clients';
        const PROD = 'https://anartz-mugika.com/gesti-hotels/web/api/stays/add/clients'
        console.log('Start to add / update active stays in current day');
        const request = require('request');
        request.get({
            headers: { 'content-type': 'application/json' },
            url: 'http://localhost:5000/reservas/actual'
        }, function (error: any, response: Response, body: any) {
            const re_ = JSON.parse(body);
            const reservas = re_.list;
            const request = require('request');
            request.post({
                headers: { 'content-type': 'application/json' },
                url: PROD,
                body: JSON.stringify(
                    { 
                        'list': reservas
                    })
            }, function (error: any, response: Response, body: any) {
                console.log(body);
            });
        });
    }
}