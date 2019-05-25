import { Reservas } from './../db/reservas';
import { Router, Request, Response } from 'express';

const router = Router();


router.get('/messages', (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'Todo está bien!!'
    })
});

router.get('/reservas/actual', (req: Request, res: Response) => {
    var array_: any;
    var resumeFoods: any;
    const reservas = new Reservas();
    const date = new Date();
    reservas.values('date').then(function (data: any) {
        // console.log(results);
        array_ = data.list;
        resumeFoods = data.resume;
    }).then(function () {
        res.status(200).json({
            success: true,
            message: 'Reservas actuales',
            resume: resumeFoods,
            currentDay: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
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

router.get('/reservas/:day', (req: Request, res: Response) => {
    console.log(req.params)
    var array_: any;
    const reservas = new Reservas();
    reservas.values('date', req.params.day).then(function (results) {
        // console.log(results);
        array_ = results;
    }).then(function () {
        res.status(200).json({
            success: true,
            message: `${req.params.day} reservations list`,
            currentDay: req.params.day,
            results: array_.length,
            array: array_
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