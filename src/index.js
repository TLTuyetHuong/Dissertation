const passport = require('passport');
const bodyParser = require("body-parser");
const express = require('express');
const session = require('express-session')
const morgan = require('morgan');
const cors = require("cors");
const methodOverride = require('method-override')
const multer = require('multer');
const bcrypt = require('bcrypt')
const { expressjwt: jwt } = require("express-jwt");
const hbs = require('express-handlebars');
const app = express();
const port = 5000;

const route = require('./routes');
const db = require('./config/db');

// Connect to DB
db.connect();

app.use(express.static('./src/public'));

// var corsOptions = {
//     origin: "http://localhost:3001"
// };
  
// app.use(cors(corsOptions));

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

//configuring bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Custom middlewares
// app.use(SortMiddleware);

// app.use(morgan('combined'));

app.use(session({
    secret: 'adsa897adsa98bs',
    resave: false,
    saveUninitialized: false,
}))

app.engine(
    'hbs',
    hbs.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        }
    }),
);
app.set('view engine', 'hbs');
app.set('views', './src/resources/views');

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
