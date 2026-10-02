const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

const key = require('./config/keys');

const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const Product = require('./models/Product');


mongoose.connect(key.mongoUrl)
        .then( ()=> console.log("MongoDB connected"))
        .catch( err => console.log(err));
const app = express();

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//=========================================
app.use('/api/auth/', authRouter);
app.use('/api/category/', categoryRouter);
app.use('/api/product/', productRouter);

app.listen(5001, () => console.log('Port 5001'));
