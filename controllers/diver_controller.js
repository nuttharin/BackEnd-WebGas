const { pool } = require('../dbConfig');
const userModel = require('../model/user_model');
const functionForData = require('../function/functionForData');
const moment = require('moment');
const bcrypt = require('bcrypt');


// Data for response api
let resData = {
    status : "",
    statusCode : 200 ,
    data : ""
}
// varible 
let sql = "" ;

getDiverAll = (req , res , next) => {
    sql = ``;

    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                //console.log(err); 
                resData.status = "error"; 
                resData.statusCode = 200 ;
                resData.data = err ;
                res.status(resData.statusCode).json(resData)
            }
            else
            {    
                resData.status = "success"; 
                resData.statusCode = 201 ;
                resData.data = result.rows ;
                res.status(resData.statusCode).json(resData);
            }
        }
    );    
}

getDiverDetailAll = (req , res , next) => {

}

getDiverDetailByDiverId = (req , res , next) => {
    let data = req.query.driver_id

    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( driver_id )";    
        res.status(200).json(resData);
    }   
    else {
        sql = `SELECT tb_rider.name , tb_rider."idCard" , tb_rider.phone , tb_rider.email FROM tb_rider
                WHERE tb_rider.id = ${data}`;

        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err); 
                    resData.status = "error"; 
                    resData.statusCode = 200 ;
                    resData.data = err ;
                    res.status(resData.statusCode).json(resData)
                }
                else
                {   
                   
                    resData.status = "success"; 
                    resData.statusCode = 201 ;
                    resData.data = result.rows ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
}





module.exports = {
    getDiverAll ,
    getDiverDetailAll,
    getDiverDetailByDiverId
}