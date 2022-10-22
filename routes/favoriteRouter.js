const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Favorite.findOne({user: req.user._id})
    .populate('dishes.dish')
    .populate('user')
    .then((favorites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch((err)=> next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorite.findOne({user: req.user._id})
    .then((favorite)=>{
        if(favorite == null) {
            Favorite.create({user: req.user._id})
            .then((fav)=>{
                for(let i=0; req.body.length; i++) {
                    fav.dishes.push({dish: req.body[i]._id});
                } 
                fav.save()
                .then((favorites)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },(err)=> next(err))
            },(err)=> next(err))
        } else {
            console.log(req.body);
            for(let i=0; i<req.body.length; i++){
                if(!favorite.dishes.some(dishs => JSON.stringify(dishs.dish) === 
                       JSON.stringify(req.body[i]._id))){
                        favorite.dishes.push({dish: req.body[i]._id});
                 }
            }
                favorite.save()
                .then((favorites)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },(err)=> next(err))
        }
    })
    .catch((err)=> next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/ ' );
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Favorite.remove({user: req.user._id})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err)=>next(err));
});

//with id
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/ ' + req.params.dishId );
})
.post(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    Favorite.findOne({user: req.user._id})
    .then((favorite)=>{
        if(favorite == null) {
            //req.body.user = req.user._id;
            Favorite.create({user:req.user.id})
            .then((fav)=>{
                fav.dishes.push({dish:req.params.dishId});
                fav.save()
                .then((favorites)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },(err)=> next(err))
            },(err)=> next(err))
        } else {
            if(!favorite.dishes.some(dish => JSON.stringify(dish.dish) === 
                       JSON.stringify(req.params.dishId))){
                favorite.dishes.push({dish:req.params.dishId});
                console.log("hey")
                favorite.save()
                .then((favorites)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },(err)=> next(err))
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }
            
        } 
    })
    .catch((err)=> next(err));
})
.put(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/ ' + req.params.dishId + 
        ' is not supported');
})
.delete(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    Favorite.findOne({user: req.user._id})
    .then((favorite)=>{
        if(favorite != null){
            favorite.dishes = favorite.dishes.filter(e=> JSON.stringify(e.dish) !== JSON.stringify(req.params.dishId));
            favorite.save()
            .then((favorites)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            },(err)=> next(err))     
        }else {
            res.end("Nothing to delete");
        } 
        
    })
    .catch((err)=> next(err));
})


module.exports = favoriteRouter;
