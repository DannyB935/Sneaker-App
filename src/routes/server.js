const express = require('express');
const router = express.Router();
const { body, validationResults, validationResult } = require('express-validator');
const passport = require('passport');

router.get('/', (req, res, next)=>{
    res.render('index');
});

module.exports = router;