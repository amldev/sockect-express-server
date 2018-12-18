import { Reservas } from './../db/reservas';
import { Router, Request, Response } from 'express';

const router = Router();


router.get('/messages', (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'Todo está bien!!'
    })
});

router.get('/reservas', (req: Request, res: Response) => {
    var array_: any;
    const reservas = new Reservas();
    reservas.values().then(function (results) {
        // console.log(results);
        array_ = results;
    }).then(function () {
        res.status(200).json({
            success: true,
            message: 'todos retrieved Hola!!',
            o: array_.length,
            array: array_
        })
    }).catch(error => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error,
            array: []
        })
    });

});

router.get('/reservas/actual', (req: Request, res: Response) => {
    var array_: any;
    const reservas = new Reservas();
    reservas.values('date').then(function (results) {
        // console.log(results);
        array_ = results;
    }).then(function () {
        res.status(200).json({
            success: true,
            message: 'Reservas actuales',
            o: array_.length,
            array: array_
        })
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