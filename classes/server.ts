import { SERVER_PORT } from './../global/environment';

import express from 'express';

import socketIO from 'socket.io';

import http from 'http';
import { NutritionalRegimenValues } from '../enums/nutritional_regimen';
import { FoodShiftValues } from '../enums/food-shifts';

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
        this.httpServer.listen(this.port, callback);
        this.httpServer.on('listening', function () {
            // server ready to accept connections here
            console.log('Hola!!');
            const request = require('request');
            request.get({
                headers: { 'content-type': 'application/json' },
                url: 'http://localhost:5000/reservas/actual'
            }, function (error: any, response: any, body: any) {
                const re_ = JSON.parse(body);
                // console.log(re_.list);
                const reservas = re_.list;
                let anulaciones = 0;
                let clientAdd = false;
                for (let i = 0; i < reservas.length; i++) {
                    const reserva = reservas[i];
                    if (reserva.status === 'A') {
                        console.log('Anulado!', reserva.client.name);
                        anulaciones++;
                    } else {
                        if (!clientAdd) {
                            /*const request = require('request');
                            request.post({
                                headers: { 'content-type': 'application/json' },
                                url: 'http://127.0.0.1:8000/api/stay/add/client',
                                body: JSON.stringify(
                                    { 
                                        'token': 'd1a9356cbed83ecd0215afa478610c38', 
                                        'idclient': reserva.client.id, 
                                        'room': reserva.room.number,
                                        'count': reserva.count_number,
                                        'start_data': reserva.start_data,
                                        'finish_data': reserva.finish_data,
                                        'entry_in': FoodShiftValues[reserva.entry_in],
                                        'nutritional_regimen': NutritionalRegimenValues[reserva.service],
                                        'active': 1,
                                        'language': 'es',
                                        'name': reserva.client.name,
                                        'exit_in': FoodShiftValues[reserva.entry_in],
                                        'reservation': reserva.reservation,
                                        'r_internal': reserva.r_internal
                                    })
                            }, function (error: any, response: any, body: any) {
                                console.log(body);
                            });*/
                            console.log({ 
                                'token': 'd1a9356cbed83ecd0215afa478610c38', 
                                'idclient': reserva.client.id, 
                                'room': reserva.room.number,
                                'count': reserva.count_people,
                                'start_data': reserva.entry_data,
                                'finish_data': reserva.exit_data,
                                'entry_in': FoodShiftValues[reserva.entry_in],
                                'nutritional_regimen': NutritionalRegimenValues[reserva.service],
                                'active': 1,
                                'language': 'es',
                                'name': reserva.client.name,
                                'exit_in': FoodShiftValues[reserva.entry_in],
                                'reservation': reserva.reservation,
                                'r_internal': reserva.r_internal
                            });
                            clientAdd = true;
                        }
                        
                    }
                }
            });
        });
    }

}