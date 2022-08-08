const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { createUser, checkUser } = require('./database');
const { getConnection } = require('./database');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

//*Serialize user
passport.serializeUser((user, done)=>{
    done(null, user.username);
});

//*Checks if the user exists in database
passport.deserializeUser(async (user, done)=>{

    const connection = await getConnection();
    const queryRes = await connection.query("SELECT * FROM users WHERE username='"+user+"' and deleted=0;");

    if(queryRes.length >= 1){

        done(null, user);
    }

});

//*Login Strategy
passport.use('login', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, user, password, done)=>{

    const connection = await getConnection();
    //*Checks if the user exists
    const rowsLogin = await connection.query("SELECT * FROM users WHERE username='"+user+"' and deleted=0");
    
    if(rowsLogin.length >= 1){

        //*Gets the hashed password from database
        const hashedPassword = rowsLogin[0].password;
        
        //*Compares the hashed password with the password input
        if(bcrypt.compareSync(password, hashedPassword)){
            console.log("Login success");
            
            const newUser = {

                username: rowsLogin[0].username,
                password: rowsLogin[0].password

            }

            //*Serialize the user
            done(null, newUser);
        }else{
            
            return done(null, false, req.flash('errorLogin', 'El usuario o la contraseña son incorrectos'));

        }
    }else{

        return done(null, false, req.flash('errorLogin','El usuario o la contraseña son incorrectos'));

    }

}));