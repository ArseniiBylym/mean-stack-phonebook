const path = require(`path`);
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const isAuth = require('./middlewares/isAuth');

const app = express();

// Middlevares
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

// Main routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/contacts', isAuth, require('./routes/contacts.route'));
app.use('/api/history', isAuth, require('./routes/history.route'));

// Error handling
app.use((error, req, res, next) => {
    console.log(error)
    const {statusCode = 500, message, errors} = error;
    return res.status(statusCode).json({message, errors});
});
// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

mongoose
    .connect(process.env.MONGO_DB_URI, {useNewUrlParser: true})
    .then(() => {
        app.listen(process.env.PORT || 5000);
        console.log('Server listen on port 5000');
    })
    .catch(error => {
        console.log('connection error')
        console.log(error);
    });
