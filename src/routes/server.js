const express = require('express');
const router = express.Router();
const { body, validationResults, validationResult } = require('express-validator');
const passport = require('passport');
//*This is just to test the database
const { getConnection } = require('../database');

//*Login page

router.get('/', (req, res, next)=>{
    res.render('index');
});

router.post('/', 

    body('user').isLength({min: 5, max: 20}),

    (req, res, next)=>{

        //*Get all the errors validating the username
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            res.render('index', {errorL: "Usuario debe contener minimo 5 caracteres, maximo 20"});
        }else{

            next();
        }
    },
    //*Use passport to check if the user exists
    passport.authenticate('login',{
        successRedirect: '/sneaker-list',
        failureRedirect: '/sneaker-list',
        passReqToCallback: true
    })

);

//* Sneakers list

router.get('/sneaker-list',(req, res, next)=>{

    
    //*Checks if the user has been authenticated
    if(req.isAuthenticated()){
        res.render('sneakerList');
    }else{
        res.redirect('/');
    }

});

module.exports = router;