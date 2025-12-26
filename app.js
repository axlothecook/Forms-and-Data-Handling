const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('node:path');
const usersRouter = require('./routes/usersRouter');
require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/', usersRouter);
app.use(morgan('dev'));

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));


const PORT = process.env.NODE_ENV || 3005;
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`My first express app - on port ${PORT}`);
});
