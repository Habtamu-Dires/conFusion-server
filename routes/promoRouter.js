const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const promoRouter = express.Router();

const Promos = require('../models/promotions');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next)=> {
    Promos.find({})
    .then((promos)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Promos.create(req.body)
        .then((promo)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err)=> next(err))
        .catch((err)=> next(err));
    } else {
        err = new Error('You are not authorized');
        err.status = 403;
        return next(err);
    }
})
.put(authenticate.verifyUser,(req,res,next)=> {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Promos.remove({})
        .then((resp)=>{
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err)=> next(err))
        .catch((err)=>next(err));
    } else {
        err = new Error('You are not authorized');
        err.status = 403;
        return next(err);
    }
});
//for /:promoId
promoRouter.route('/:promoId')
.get((req,res,next)=>{
    Promos.findById(req.params.promoId)
    .then((promo)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/ ' + req.params.promoId);
})
.put(authenticate.verifyUser,(req,res,next)=> {
    if(authenticate.verifyAdmin(req.user.admin)){
        Promos.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        },{new: true})
        .then((promo)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err)=> next(err))
        .catch((err)=> next(err));
    } else {
        err = new Error('You are not authorized');
        err.status = 403;
        return next(err);
    }
})
.delete(authenticate.verifyUser,(req,res,next)=> {
    if(authenticate.verifyAdmin(req.user.admin)){
        Promos.findByIdAndRemove(req.params.promoId)
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err)=>next(err))
        .catch((err)=>next(err));
    } else {
        err = new Error('You are not authorized');
        err.status = 403;
        return next(err);
    }
});


module.exports = promoRouter;
