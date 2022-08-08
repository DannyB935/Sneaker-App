const mysql = require('promise-mysql');
//const { promisify } = require('util');

const connection = mysql.createConnection({

    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE

});

function getConnection(){
    return connection;
}

module.exports = { getConnection }

// const pool = mysql.createPool({

//     host: process.env.HOST_DB,
//     user: process.env.USER_DB,
//     password: process.env.PASSWORD_DB,
//     database: process.env.DATABASE

// });

// pool.getConnection((error, connection)=>{

//     if(error){
//         console.log(error);
//     }else{

//         if(connection){
//             connection.release();
//         }

//     }
//     return;

// });

// pool.query = promisify(pool.query);

// module.exports = pool;