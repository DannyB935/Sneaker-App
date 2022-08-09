const express = require('express');
const router = express.Router();
const { body, validationResults, validationResult } = require('express-validator');
const passport = require('passport');
//*This is just to test the database
const { getConnection } = require('../database');
const bcrypt = require('bcrypt');

const multer = require('multer');
const hash = require('crypto-js/md5');

//*Multer config
const uploadImg = multer.diskStorage({
    destination: "src/public/images",
    filename: (req, file, cb)=>{
        
        //!We have to save the file with the hashed name and extension
        let splitName = file.originalname.split(".");
        let ext = splitName[splitName.length-1];

        let hashedName = hash(file.originalname).toString();

        let newName = hashedName + "."+ ext;
        //*We upload the file
        cb(null, newName);
    }
});

const upload = multer({
    storage: uploadImg
});

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

            return next();
        }
    },
    //!Use passport to check if the user exists
    passport.authenticate('login',{
        successRedirect: '/adminList',
        failureRedirect: '/',
        passReqToCallback: true
    })

);

//* Admin List

router.get('/adminList', async (req, res, next)=>{
    
    if(req.isAuthenticated()){
        const connection = await getConnection();
        const adminList = await connection.query("SELECT * FROM users WHERE deleted=0");

        res.render('adminList', {list: adminList});
    }else{
        res.redirect('/');
    }

});

//*Add Admin
router.get('/addAdmin', (req, res, next)=>{

    res.render('addAdmin');

});

router.post('/addAdmin',
    body('user').isLength({min: 5, max: 20}),
    async(req, res, next)=>{

        const errors = validationResult(req);
        //*If there are errors
        if(!errors.isEmpty()){
            res.render('addAdmin', {adminError: 'El usuario debe tener 5 caracteres minimo, 20 maximo'});
        }else{

            const connection = await getConnection();
            
            let salt = bcrypt.genSaltSync(15);
            let hashedPassword = bcrypt.hashSync(req.body.password, salt);

            const newAdmin = {

                username: req.body.user,
                password: hashedPassword

            }

            //*Insert into the database
            const ans = await connection.query("INSERT INTO users SET ?", newAdmin);
            
            res.redirect('/adminList');

        }

    
});

//* Sneakers list

router.get('/sneakerList', (req, res, next)=>{

    if(req.isAuthenticated()){
        res.render('sneakerList');
    }else{
        res.redirect('/');
    }

});

//* Add Sneaker

router.get('/add',(req, res, next)=>{

    if(req.isAuthenticated()){
        res.render('addSneaker');
    }else{
        res.redirect('/');
    }
    
});

router.post('/add',
    //*Since it's too complicated to validate the body and file form, we will only let the user know if some form field is wrong but still saving the image
    upload.single('image')
    //*After that, we validate the form fields
    ,body('name').isLength({min: 5, max: 50}),

    async (req, res, next)=>{
        //*If there are errors 
        if(!validationResult(req).isEmpty()){
            res.render('addSneaker', { errorMsg: 'El nombre debe ser minimo 5 caracteres, 50 maximo' });
        }else{
            
            if(!req.file){
                 res.render('addSneaker', { errorMsg: 'La imagen no puede ser guardada' });
            }else{

                //*We save the sneaker into the database

                const newSneaker = {

                    name: req.body.name,
                    brand: req.body.brand,
                    price: parseFloat(req.body.price),
                    image: req.file.filename,
                    deleted: 0

                }
                
                const connection = await getConnection();
                const resQuery = await connection.query("INSERT INTO sneaker SET ?", newSneaker);

                //*Insert size into sizes table
                const newSize = {

                    size: parseFloat(req.body.size),
                    sneaker_id: resQuery.insertId,
                    stock: parseInt(req.body.stock)

                }

                const resSizes = await connection.query("INSERT INTO sizes SET ?", newSize);

                console.log(resQuery);
                console.log(resSizes);

                console.log(req.body);
                console.log(req.file);
                res.redirect('/sneakerList');

            }

        }
        
    }
);

module.exports = router;