const { pool } = require('../dbConfig');
const userModel = require('../model/user_model');
const functionForData = require('../function/functionForData');
const moment = require('moment');


// Data for response api
let resData = {
    status : "",
    statusCode : 200 ,
    data : ""
}
// varible 
let sql = "" ;


getProblemInMachine = (req , res , next) => {

}

getProblemInIoT = (req , res , next) => {

}


getProblemAll = (req , res , next) => {

}


module.exports = {

}