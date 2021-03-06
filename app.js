const express = require('express');

const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app  = express();

// const mongoClient = require('mongodb');



require('dotenv').config()




app.use(morgan('dev')); // เเสดงการทำงาน


app.use(bodyParser.urlencoded({extended : false})); // false ใช้อัลกอในการ map json ธรรมดา ,true = high
app.use(bodyParser.json());
app.use(compression());
app.use(express.static('uploads'));

//---------------Access-Control-Allow-Origin----------
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Orgin, X-Requested-With, Content-Type, Accept,Authorization,authorization,content-type');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next(); // ไปต่อ
})




//set route

const userRoute = require('./routes/user_route');
const tokenRoute = require('./routes/token_route');
const orderRoute = require('./routes/order_route');
const driverRoute = require('./routes/diver_route');
const storeRoute = require('./routes/store_route');
const problemRoute = require('./routes/problem_route');
const generalRoute = require('./routes/general_route');
const appManageRoute = require('./routes/appManage_route')


app.use('/web/user',userRoute);
app.use('/web/mobile',appManageRoute)
app.use('/web/token',tokenRoute);
app.use('/web/order',orderRoute);
app.use('/web/driver',driverRoute);
app.use('/web/store',storeRoute);
app.use('/web/problem',problemRoute);
app.use('/web/general',generalRoute);





module.exports = app ;
