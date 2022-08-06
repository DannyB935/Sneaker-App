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

    //*Delete async after testing database connection
    async (req, res, next)=>{

    //*Get all the errors validating the username
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        res.render('index', {errorL: "Usuario debe contener minimo 5 caracteres, maximo 20"});
    }else{
        
        const connection = await getConnection();
        const rows = await connection.query('SELECT * FROM users WHERE deleted=0');
        console.log(rows);

        next();
    }


});

module.exports = router;