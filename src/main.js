const express = require('express');
const expressApp = express();
const { app, BrowserWindow } = require('electron');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

require('dotenv').config({ path: 'src/.env' })

//*Auth and DB connections
require('./database');

//*Server settings
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('port', process.env.PORT);
expressApp.set('view engine', 'ejs');

//*Middlewares
expressApp.use(express.static(__dirname + '/public'));
expressApp.use(express.urlencoded({extended: false}));
expressApp.use(session({
    secret: 'secretKey',
    saveUninitialized: false,
    resave: false
}));
expressApp.use(flash());
expressApp.use(passport.initialize());
expressApp.use(passport.session());
//*Middleware for flash messages

//

//* Routes
expressApp.use('/', require('./routes/server'));

//* Server starts
expressApp.listen(expressApp.get('port'), ()=>{
    console.log('Server is ready on localhost:',expressApp.get('port'));
});

//*Electron starts
var window;

function createWindow(){

    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: true
    })

    window.loadURL('http://localhost:'+process.env.PORT+'/');

}

app.allowRendererProcessReuse = false;
app.whenReady().then(()=>{
    createWindow();
});