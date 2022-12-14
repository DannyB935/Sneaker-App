const express = require('express');
const expressApp = express();
const { app, BrowserWindow } = require('electron');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');
const hash = require('crypto-js/md5');

require('dotenv').config({ path: 'src/.env' })

//*Auth and DB connections
require('./database');
require('./auth');

//*Server settings
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('port', process.env.PORT);
expressApp.set('view engine', 'ejs');

//*Middlewares
expressApp.use(express.static(__dirname + '/public'));
expressApp.use(express.urlencoded({extended: true}));

expressApp.use(session({
    secret: 'secretKey',
    saveUninitialized: false,
    resave: false
}));
expressApp.use(flash());
expressApp.use(passport.initialize());
expressApp.use(passport.session());
//*Middleware for flash messages

expressApp.use((req, res, next)=>{

    //*We use locals to get the arrays with the error messages that we use
    expressApp.locals.loginErrors = req.flash('errorLogin');
    next();
     
});

//* Routes
expressApp.use('/', require('./routes/server'));

//* Server starts
expressApp.listen(expressApp.get('port'), ()=>{
    //console.log('Server is ready on localhost:',expressApp.get('port'));
});

//*Electron starts
var window;

function createWindow(){

    window = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: true
    })

    window.removeMenu();
    window.loadURL('http://localhost:'+process.env.PORT+'/');

}

app.allowRendererProcessReuse = false;
app.whenReady().then(()=>{
    createWindow();
});