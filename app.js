const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// App
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Database
// mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true // commented out currently
// });
mongoose.connect('mongodb://localhost:27017/testeWebAPI', {
    useNewUrlParser: true,
    useUnifiedTopology: true // commented out currently
});

const db = mongoose.connection;
  
db.on('connected', () => {
    console.log('Mongoose default connection is open');
});

db.on('error', err => {
    console.log(`Mongoose default connection has occured \n${err}`);
});

db.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected');
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log(
        'Mongoose default connection is disconnected due to application termination'
        );
        process.exit(0);
    });
});

// Load models
const Mentions = require('./models/mentions');
const Users = require('./models/users');


// Load routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const mentionsRoutes = require('./routes/mentions-routes');
app.use('/mentions', mentionsRoutes);

const usersRoutes = require('./routes/user.routes');
app.use('/user', usersRoutes);

module.exports = app;
