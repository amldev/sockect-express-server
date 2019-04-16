import { Capitalize } from './capitalize';
const DBFFile = require('dbffile');
const PATH_FILE = '/Volumes/DATA/Gesti\ Hotels/HTRES62.DBF';
export class Reservas {

    values(filter?: string) {
        return new Promise(function (resolve, reject) {
            DBFFile.open(PATH_FILE)
                .then((dbf: any) => {
                    const date = new Date();
                    console.log('File read in:');
                    console.log(date.getFullYear(), date.getMonth() + 1, date.getDate());
                    console.log(date.getHours(), date.getMinutes(), date.getSeconds());
                    console.log(`DBF file contains ${dbf.recordCount} rows.`);
                    // console.log(`Field names: ${dbf.fields.map((f: any) => f.name)}`);
                    return dbf.readRecords();

                })
                // Lo que se va a mostrar
                .then((rows: any) => {
                    // console.log(rows)
                    const list: any = [];
                    rows.map((object: any) => {
                        try {
                            const row = {
                                client: {
                                    id: object.R_CLI_USU,
                                    name: new Capitalize().transform(object.R_NOMBRE, true)
                                },
                                reservation: object.R_NUMERO,
                                entry_data: object.R_F_ENTRA,
                                // 'entry_data_ts': object.R_F_ENTRA.getTime(),
                                exit_data: object.R_F_SALIDA,
                                // 'exit_data_ts': object.R_F_SALIDA.getTime(),
                                service: object.R_SERVICIO,
                                shift: {
                                    entry: object.R_S_ENTRA,
                                    exit: object.R_S_SALID,
                                },
                                room: {
                                    number: object.R_NUM_HAB,
                                    type: object.R_TIPO,
                                },
                                count_people: object.R_PERS_TN + object.R_PERS_TD,
                                tn: object.R_PERS_TN,
                                td: object.R_PERS_TD,
                                rooms_count: object.R_CANT_HB
                            };
                            if (filter === 'date') {
                                if (row.entry_data !== undefined || row.entry_data !== null
                                    && row.exit_data !== undefined || row.exit_data !== null) {
                                    // console.log(i);
                                    // console.log(item.entry_data);
                                    // const exit = item.exit_data.getTime();
                                    // console.log(item.exit_data);
                                    const entry = row.entry_data.getTime();
                                    const exit = row.exit_data.getTime();
                                    const currentDay = new Date();
                                    const date = new Date(2018, 7, 15, 1, 0, 0);
                                    const currentTimeStamp = date.getTime();
                                    if (entry <= currentTimeStamp && exit >= currentTimeStamp) {
                                        list.push(row);
                                    }
                                }

                            } else {
                                list.push(row);
                            }
                        } catch (e) {

                        }

                    });
                    resolve(list);

                })
                .catch((err: any) => {
                    console.log('An error occurred: ' + err);
                    reject(err);
                });
        })
    }

    /*addInServer(values: any) {
        const request = require('request');
        request.post({
            headers: { 'content-type': 'application/json' },
            url: 'https://mugan86.com/test/take_data.php',
            body: JSON.stringify({ 'nombre': 'Anartz', 'edad': 33, 'values': values})
        }, function (error: any, response: any, body: any) {
            console.log(body);
        });
    }*/

    showData() {

    }

    takeClientInHotel() {
        // CUrrent data
        // console.log(arr.filter(e => e.foo === 'bar')); // [{foo: 'bar'}, {foo: 'bar'}]*/
        const date = new Date(2018, 9, 1, 1, 0, 0);
        const currentTimeStamp = date.getTime();

        return this.values().then(
            (value: any) => {
                const list = [];
                for (var i = 0; i < value.length; i++) {
                    const item = value[i];
                    try {
                        // const entry = item.entry_data.getTime();
                        if (item.entry_data !== undefined && item.exit_data !== undefined) {
                            // console.log(i);
                            // console.log(item.entry_data);
                            // const exit = item.exit_data.getTime();
                            // console.log(item.exit_data);
                            const entry = item.entry_data.getTime();
                            const exit = item.exit_data.getTime();
                            if (entry <= currentTimeStamp && exit >= currentTimeStamp) {
                                list.push(item);
                            }

                        }

                    } catch (e) {
                        console.error(e)
                    }
                }
                console.log(currentTimeStamp);
                return list;
            }

        ).catch(
            e => e
        );
    }
}