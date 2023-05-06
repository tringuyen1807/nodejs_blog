// lib
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// api
const register = require('./routes/register')
const login = require('./routes/login')
const mail = require('./routes/sendemail')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// dotenv
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// flash
const flash = require('express-flash');
const cookieParser = require('cookie-parser');

app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


// homepage
app.get('/index', (req, res) => {
    if (req.session && req.session.user){
        res.render("index")
    }else{
        res.redirect('/login')
    }
})
// register
app.use('/', register)

// login
app.use('/', login)

// mail
app.use('/', mail)

// Kết nối tới MongoDB
mongoose.connect(DB_URI, console.log('db connected')
)

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))