const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { getConnection } = require('./database');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

passport.serializeUser((user, done)=>{
    console.log('Serialize user');
    done(null, user);
});


passport.deserializeUser(async (user, done)=>{
    //*Checks if the user exists on the database and use the username to deserialize
    console.log('Deserialize User');
    const connection = await getConnection();
    const queryRes = await connection.query("SELECT * FROM users WHERE username='"+user.username+"' and deleted=0;");

    //*Need to fix if it cant find the user
    if(queryRes.length >= 1){

        done(null, user);
    }

});

passport.use('login', new LocalStrategy({

    usernameField: "user",
    passwordField: "password",
    passReqToCallback: true

    },
    async (req, user, password, done)=>{

        const connection = await getConnection();
        const rows = await connection.query("SELECT * FROM users WHERE username='"+user+"' and deleted=0;");

        //*If the query finds the user, we have to check if is the same password
        if(rows.length >= 1){
            const hashedPasswordDB = rows[0].password;

            //*If the passwords match we send a success login
            if(bcrypt.compareSync(password, hashedPasswordDB)){
                console.log('Log in success');
                const loggedUser = {
                    username: rows[0].username,
                    password: rows[0].password
                }

                done(null, loggedUser);

            }else{

                //*If the password is incorrect we send a message to the index
                return done(null, false, req.flash('errorLogin', 'El ususario o la contraseña son incorrectos'));

            }
        }else{

            //*If the user is incorrect we create a flash message to show on the index/log in page
            return done(null, false, req.flash('errorLogin', 'El ususario o la contraseña son incorrectos'));
        }

    }

));