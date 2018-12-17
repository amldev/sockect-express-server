const DBFFile = require('dbffile');

export class Reservas {
    values() {
        return new Promise(function (resolve, reject) {
            DBFFile.open('/Volumes/DATA/Gesti\ Hotels/HTRES62.DBF')
                .then((dbf: any) => {
                    console.log(`DBF file contains ${dbf.recordCount} rows.`);
                    console.log(`Field names: ${dbf.fields.map((f: any) => f.name)}`);
                    return dbf.readRecords();

                })
                // Lo que se va a mostrar
                .then((rows: any) => {
                    // console.log(rows)
                    const array: any = [];
                    rows.map( (object: any) => 
                    {
                      
                        const row = {
                            client: {
                                id:     object.R_CLI_USU,
                                name:   object.R_NOMBRE
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
                                type:   object.R_TIPO,
                            },
                            count_people: object.R_PERS_TN + object.R_PERS_TD,
                            tn: object.R_PERS_TN,
                            td: object.R_PERS_TD,
                            rooms_count: object.R_CANT_HB
                        };
                        if (row.room.type === '1') {
                            array.push(row);
                        }
                        
                    });
                    resolve(array);
                    /*for (var i = 0; i < rows.length; i++) {
                        const object = rows[i];

                        if (object.R_NOMBRE.indexOf('andre') === -1) {
                            /*try {
                                console.log(object.R_F_ENTRA.getFullYear());
                                console.log(object.R_F_ENTRA.getMonth() + 1);
                                console.log(object.R_F_ENTRA.getDate());
                                console.log((object.R_F_ENTRA).toString().substring(0, 10));
                            } catch (err) {
                                console.error(err);
                            }
                            
                            
                        }

                    };*/
                    
                })
                .catch((err: any) => {
                    console.log('An error occurred: ' + err);
                    reject(err);
                });
        })
    }
}