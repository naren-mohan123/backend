const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const Favorite = require("../models/favorite");
const Dishes = require("../models/dishes");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route("/")
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Favorite.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser , (req,res,next) => {
    Favorite.findOne({user : req.user._id})
    .then((favorite) => {
        if(favorite){
            for(var i = 0;i<req.body.length;i++){
                if(favorite.dishes.indexOf(req.body[i]._id)===-1) 
                favorite.dishes.push(req.body[i]._id);
            }
            favorite.save()
            .then((favorite) => {
                 Favorite.findById(favorite._id)
                .populate("user")
                .populate("dishes")
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
            },(err) => next(err));
        })}
        else{
            Favorite.create({user : req.user._id})
            .then((favorite) => {
                for(var i = 0;i<req.body.length;i++){
                    if(favorite.dishes.indexOf(req.body[i]._id)===-1) 
                    favorite.dishes.push(req.body[i]._id);
                    favorite.save()
                    .then((favorite) => {
                        Favorite.findById(favorite._id)
                        .populate("user")
                        .populate("dishes")
                        .then((favorite) => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                }
            })
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndRemove({"user" : req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)); 
});



favoriteRouter.route("/:dishId")
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions,authenticate.verifyUser , (req,res,next) => {
    Favorite.findOne({user : req.user._id})
    .then((favorite) => {
        if(!favorite){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists" : false, "favourites" : favorite});
        }
        else{
            if(favorite.dishes.indexOf(req.params.dishId)<0){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists" : false, "favourites" : favorite});
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists" : true, "favourites" : favorite});
            }
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser , (req,res,next) => {
    Favorite.findOne({user : req.user._id})
    .then((favorite) => {
        if(favorite){
            if(favorite.dishes.indexOf(req.params.dishId)===-1) 
            favorite.dishes.push(req.params.dishId);
            favorite.save()
            .then((favorite) => {
                Favorite.findById(favorite._id)
                .populate("user")
                .populate("dishes")
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            },(err) => next(err));
        }
        else{
            Favorite.create({"user" : req.user._id})
            .then((favorite) => {
                favorite.dishes.push({"_id" : req.params.dishId})
            .favorite.save()
            .then((favorite) => {
                Favorite.findById(favorite._id)
                .populate("user")
                .populate("dishes")
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            },(err) => next(err));
        })}
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({"user" : req.user._id})
    .then((favorite) => {
        if(favorite){
                index = favorite.dishes.indexOf(req.params.dishId);
                if(index>=0){
                    favorite.dishes.splice(index,1);
                    favorite.save()
                    .then((favorite) => {
                        Favorite.findById(favorite._id)
                        .populate("user")
                        .populate("dishes")
                        .then((favorite) => {
                             res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                    },(err) => next(err));
                })}
                else{
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }
        else{
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err)); 
});

module.exports = favoriteRouter;