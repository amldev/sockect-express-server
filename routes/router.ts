import { Reservas } from './../db/reservas';
import { Router, Request, Response } from 'express';

const router = Router();


router.get('/messages', (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'Todo está bien!!'
    })
});

router.get('active/stays', (req: Request, res: Response) => {
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
        const request = require('request');
        request.post({
            headers: { 'content-type': 'application/json' },
            url: 'http://127.0.0.1:8000/api/stays/add/clients',
            body: JSON.stringify(
                { 
                    'list': reservas
                })
        }, function (error: any, response: any, body: any) {
            console.log(body);
        });
    });
})

router.get('/reservas/actual', (req: Request, res: Response) => {
    var array_: any;
    var resumeFoods: any;
    const reservas = new Reservas();
    const date = new Date();
    console.log(req.params);
    reservas.values('date').then(function (data: any) {
        // console.log(results);
        array_ = data.list;
        resumeFoods = data.resume;
    }).then(function () {
        res.status(200).json({
            success: true,
            message: 'Reservas actuales',
            resume: resumeFoods,
            selectDay: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            results: array_.length,
            list: array_
        });

        // To Send data to database
        // reservas.addInServer(array_);
        
    }).catch(error => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error,
            list: []
        })
    });

});

router.get('/reservas/:day/:regimen*?', (req: Request, res: Response) => {
    
    var array_: any;
    var resumeFoods: any;
    const reservas = new Reservas();
    let message = `${req.params.day} reservations list`
    if (req.params.day === 'actual') {
        message = 'Reservas actuales';
        req.params.day = new Date().toISOString().substring(0, 10);
    }
    if(req.params.regimen === undefined) {
        req.params.regimen = '-';
    }
    console.log(req.params);
    reservas.values('date', req.params.day, req.params.regimen).then(function (data: any) {
        // console.log(results);
        array_ = data.list;
        resumeFoods = data.resume;
    }).then(function () {
        res.status(200).json({
            success: true,
            message,
            selectDay: req.params.day,
            results: array_.length,
            resume: resumeFoods,
            list: array_
        });
    }).catch(error => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error,
            array: []
        })
    });

});

router.post('/messages/:id', (req: Request, res: Response) => {
    const body = req.body.body;
    const from = req.body.from;
    const id = req.params.id;
    res.json({
        ok: true,
        message: 'POST - Todo está bien!!',
        from,
        body,
        id
    })
});


export default router;