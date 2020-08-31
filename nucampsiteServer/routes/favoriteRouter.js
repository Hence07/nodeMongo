const express = require('express');
const authenticate = require('../authenticate');
// const multer = require('multer');
const favorite = require('../models/favorite');
const favoriteRouter = express.Router();
const cors = require('./cors');
const Favorite = require('../models/favorite');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the favorite to you');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.create(req.body)
        .then(partner => {
            console.log('Favorite Created ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        })
        .catch(err => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on/favorfites/${req.params.campsiteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    favorite.findOne({user:req.user._id})
    .then(favorite =>{
        if (favorite) {
            if(!favorite.campsites.includes(req.params.campsiteId)){
                favorite.campsites.push(req.params.campsiteId);
                favorite.save()
                .then(favorite => {
                    res.status = 200;
                    res.setHeader('content-type', 'application/json');
                    res.json(favorite)
                })
                .catch(err => next(err));
            }
        }
        else{
            res.statusCode = 200;
            res.end('That campsite is already in the list of favorites!')
        }
    }
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findByIdAndDelete(req.params.partnerId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
});

module.exports = favoriteRouter;