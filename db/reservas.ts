import { Capitalize } from './capitalize';
import { FILE_PATH } from '../global/environment';
import { ResumeFoods} from './../interfaces/resume-foods';

const DBFFile = require('dbffile');
const PATH_FILE = FILE_PATH;
export class Reservas {
    values(filter?: string, date?: string, shift?: string) {
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
                    let list: any = [];
                    let resume: ResumeFoods = {
                        stays: {
                            pc: 0,
                            mp: 0,
                            de: 0
                        },
                        total_people: {
                            pc: 0,
                            mp: 0,
                            de: 0
                        }
                    };
                    rows.map((object: any) => {
                        
                        try {
                            new Reservas().search(object.R_NUMERO, object.R_CLI_USU, list);
                            let persTD;
                            if (object.R_PERS_TD === null || object.R_PERS_TD === undefined) {
                                persTD = 0
                            } else {
                                persTD = object.R_PERS_TD
                            }
                            // console.log('TD', persTD)
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
                                    number: (object.R_NUM_HAB === '') ? 0 : object.R_NUM_HAB,
                                    type: object.R_TIPO,
                                },
                                count_people: object.R_PERS_TN + persTD,
                                tn: object.R_PERS_TN,
                                td: persTD,
                                rooms_count: object.R_CANT_HB,
                                r_internal: object.R_POSIC,
                                status: object.R_STATUS
                            };
                            
                            if (filter === 'date') {
                                
                                let currentDay;
                                if(date != undefined) {
                                    // Extract day
                                    const dateArray = date.split('-');

                                    currentDay = new Date(+dateArray[0], +dateArray[1] - 1, +dateArray[2], 1, 0, 0);
                                } else {
                                    currentDay = new Date();
                                    // console.log(currentDay)
                                }
                                const currentTimeStamp = currentDay.getTime();
                                if (row.entry_data !== undefined || row.entry_data !== null
                                    && row.exit_data !== undefined || row.exit_data !== null) {
                                    // console.log(i);
                                    // console.log(item.entry_data);
                                    // const exit = item.exit_data.getTime();
                                    // console.log(item.exit_data);

                                    
                                    const entry = row.entry_data.getTime();
                                    const exit = row.exit_data.getTime();
                                    // Adaptar al formato normal
                                    row.entry_data = new Reservas().transformDate(object.R_F_ENTRA);
                                    row.exit_data = new Reservas().transformDate(object.R_F_SALIDA);
                                    if (entry <= currentTimeStamp && exit >= currentTimeStamp) {
                                        // console.log(object.R_NOMBRE, object.R_STATUS, row.count_people);
                                        if (shift === 'mp' || shift === 'pc' || shift === 'de' || shift === 'sa' 
                                        || shift === 'MP' || shift === 'PC' || shift === 'DE' || shift === 'SA') {
                                            if (row.service === shift.toUpperCase()) {
                                                console.log('-----', row);
                                                list = new Reservas().moreRooms(object, row, list);
                                                // list.push(row);
                                                resume = new Reservas().countFoods(row.service, row.count_people, resume);
                                            }
                                            return;
                                        } else {
                                            // console.log('---- SIN TURNO!!');
                                            list = new Reservas().moreRooms(object, row, list);
                                            resume = new Reservas().countFoods(row.service, row.count_people, resume);
                                        }
                                    }
                                }

                            } else {
                                list = new Reservas().moreRooms(object, row, list);
                                resume = new Reservas().countFoods(row.service, row.count_people, resume)
                            }
                        } catch (e) {

                        }
                    });
                    console.log(resume);
                    const results = {
                        resume,
                        list
                    }
                    resolve(results);

                })
                .catch((err: any) => {
                    console.log('An error occurred: ' + err);
                    reject(err);
                });
        })
    }

    countFoods(service: string, stayCount: number, resume: any) {
        if (service === 'MP') {
            resume.total_people.mp = resume.total_people.mp + stayCount;
            resume.stays.mp = resume.stays.mp + 1;
        } else if (service === 'PC') {
            resume.total_people.pc = resume.total_people.pc + stayCount;
            resume.stays.pc = resume.stays.pc + 1;
        } else if (service === 'DE') {
            resume.stays.de = resume.stays.de + 1;
            resume.total_people.de = resume.total_people.de + stayCount;
        }
        return resume;
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
    moreRooms (object: any, row: any, list: any) {
        // console.log(object);
        console.log(row);
        if (row.rooms_count > 1) {
            // console.log('rooms', row.rooms_count);
            let rooms = [];
            const persTD = (object.R_PERS_TD === null) ? 0: object.R_PERS_TD;
            let peoplePerRoom;
            if ((object.R_PERS_TN + persTD) % row.rooms_count != 0) {
                console.log((object.R_PERS_TN + persTD) + " Persons in room and " + row.rooms_count);
                console.log(new Capitalize().transform(object.R_NOMBRE, true));
                const rest = (object.R_PERS_TN + persTD) % row.rooms_count;
                const peoplePerRoom = Math.floor((object.R_PERS_TN + persTD) / row.rooms_count);
                if (row.rooms_count === 2) {
                    console.log(peoplePerRoom, peoplePerRoom + rest)
                    rooms.push(peoplePerRoom);
                    rooms.push(peoplePerRoom + rest);
                } else {
                    console.log(row.rooms_count, 'rroms count');
                }
            } else {
                peoplePerRoom = Math.floor(object.R_PERS_TN + persTD) / row.rooms_count;
                console.log(peoplePerRoom);
            }
            for (var room = 0; room < row.rooms_count; room++) {
                console.log(rooms);
                const item =  {
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
                        number: (object.R_NUM_HAB === '') ? 0 : object.R_NUM_HAB,
                        type: object.R_TIPO,
                    },
                    count_people: peoplePerRoom,
                    tn: object.R_PERS_TN,
                    td: persTD,
                    rooms_count: 1,
                    r_internal: object.R_POSIC + room,
                    status: object.R_STATUS
                };
                // console.log(room, item)
                list.push(item);
            }
            return list;
        }
        // console.log(row);
        list.push(row);
        return list;
    }
    search(numberReservation: string, client: number, myArray: any){
        const list = [];
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].reservation === numberReservation && myArray[i].client.id === client) {
              list.push(myArray[i])
            }
        }
        return list;
    }

   
    transformDate(data: any, showHour: boolean = false): string {
        const date = new Date(String(data));
        const dayOfMonth = new Reservas().formatNumbers(date.getDate());
        const month = new Reservas().formatNumbers(date.getMonth() + 1);
        const year = date.getFullYear();

        if (!showHour) {
        return `${year}-${month}-${dayOfMonth}`;
        }

        const hour = new Reservas().formatNumbers(date.getHours());
        const mins = new Reservas().formatNumbers(date.getMinutes());
        return `${year}-${month}-${dayOfMonth} ${hour}:${mins}`;
    }

    private formatNumbers(n: number): string {
        return (n < 10) ? '0'.concat(n.toString()) : n.toString();
    }
}

