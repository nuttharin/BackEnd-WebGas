const { pool } = require('../dbConfig');
const userModel = require('../model/order_model');
const functionForData = require('../function/functionForData');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { Int32 } = require('mongodb');


let resData = {
    status : "",
    statusCode : 200 ,
    data : ""
}
// varible 
let sql = "" ;

getOrderAll = (req , res , next) => {
  
    sql = `SELECT tb_order.id ,tb_user.name , tb_machine_gas.machine_code,tb_order.priceall, send_type , TO_CHAR(tb_order."createDate" ,'DD-MM-YYYY') as date,
            TO_CHAR(tb_order."createDate" ,'HH24:MI') as time , tb_order_status.name as status
            FROM tb_order
            LEFT JOIN tb_user ON tb_order.user_id = tb_user.id
            LEFT JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
            LEFT JOIN tb_order_status ON tb_order.status = tb_order_status.id
            ORDER BY tb_order.id`;

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

getOrderbyOrderId = (req , res , next) => {
    let data = req.query.order_id

    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( order_id )";    
        res.status(200).json(resData);
    }   
    else {
        sql = `SELECT tb_order.id , tb_user.name as customer_name , tb_machine_gas.machine_code,tb_order.priceall, 
                send_type , TO_CHAR(tb_order."createDate" ,'DD-MM-YYYY') as date,
                TO_CHAR(tb_order."createDate" ,'HH24:MI') as time , tb_order_status.name as status ,
                tb_provinces.name_th as province, tb_districts.name_th as district
                , tb_subdistricts.name_th as subdistrict ,
                tb_gas_detail.name as gas_name , tb_gas_detail.price, tb_order_detail.quality ,
                COALESCE(	CAST (tb_rider.id AS TEXT),'-') as driver_id ,
                COALESCE(tb_rider.name,'-') as driver_name,
                tb_payment_channel.name as type_pay
                FROM tb_order
                LEFT JOIN tb_user ON tb_order.user_id = tb_user.id
                LEFT JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
                LEFT JOIN tb_order_status ON tb_order.status = tb_order_status.id
                LEFT JOIN tb_address_user ON tb_order.address_id = tb_address_user.id
                LEFT JOIN tb_provinces ON tb_address_user.province_id = tb_provinces.id
                LEFT JOIN tb_districts ON tb_address_user.amphure_id = tb_districts.id
                LEFT JOIN tb_subdistricts ON tb_address_user.district_id = tb_subdistricts.id
                LEFT JOIN tb_order_detail ON tb_order_detail.order_id = tb_order.id
                LEFT JOIN tb_gas_detail ON tb_order_detail.gas_id = tb_gas_detail.id
                LEFT JOIN tb_rider ON tb_order.rider_id = tb_order.rider_id
                LEFT JOIN tb_payment_channel ON tb_order.payment_id = tb_payment_channel.id
                WHERE tb_order.id = ${data}`;

        pool.query(
            sql, 
            async (err, result) => {

                if (err) {
                    //console.log(err); 
                    resData.status = "error"; 
                    resData.statusCode = 200 ;
                    resData.data = err ;
                    res.status(resData.statusCode).json(resData)
                }
                else
                {   
                    resData.data = await  {
                        id: result.rows[0].id,
                        customer_name: result.rows[0].customer_name,
                        machine_code: result.rows[0].machine_code,
                        priceall: result.rows[0].priceall,
                        send_type: result.rows[0].send_type,
                        date: result.rows[0].date,
                        time:result.rows[0].time,
                        status: result.rows[0].status,
                        prvince: result.rows[0].province,
                        district: result.rows[0].district,
                        subdistrict: result.rows[0].subdistrict,
                        driver_id : parseInt(result.rows[0].driver_id),
                        driver_name: result.rows[0].driver_name,
                        type_pay: result.rows[0].type_pay
                    }
                    resData.data.order_detail = [] ;
                    for (let i = 0; i < result.rows.length; i++) 
                    {
                        resData.data.order_detail[i] = await { gas_name : result.rows[i].gas_name , price : result.rows[i].price , quality : result.rows[i].quality}
                    }
                    resData.status = "success"; 
                    resData.statusCode = 201 ;
                    //resData.data = result.rows ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
}

getOrderByLastDay = (req , res , next) => {

    sql = ` SELECT tb_order.id ,tb_user.name , tb_machine_gas.machine_code,tb_order.priceall, send_type , TO_CHAR(tb_order."createDate" ,'DD-MM-YYYY') as date,
            TO_CHAR(tb_order."createDate" ,'HH24:MI') as time , tb_order_status.name as status
            FROM tb_order
            LEFT JOIN tb_user ON tb_order.user_id = tb_user.id
            LEFT JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
            LEFT JOIN tb_order_status ON tb_order.status = tb_order_status.id
            WHERE CAST(tb_order."createDate" as DATE) = current_date
            ORDER BY tb_order.id;`;

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

getOrderByLastWeek = (req , res , next) => {

}

getOrderByLastMonth = (req , res , next) => {
    sql = `  SELECT tb_order.id ,tb_user.name , tb_machine_gas.machine_code,tb_order.priceall, send_type , TO_CHAR(tb_order."createDate" ,'DD-MM-YYYY') as date,
            TO_CHAR(tb_order."createDate" ,'HH24:MI') as time , tb_order_status.name as status
            FROM tb_order
            LEFT JOIN tb_user ON tb_order.user_id = tb_user.id
            LEFT JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
            LEFT JOIN tb_order_status ON tb_order.status = tb_order_status.id
            WHERE EXTRACT(MONTH FROM tb_order."createDate")  = EXTRACT(MONTH FROM CURRENT_DATE) `;

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

getOrderByLastYear= (req , res , next) => {
    sql = `SELECT tb_order.id ,tb_user.name , tb_machine_gas.machine_code,tb_order.priceall, send_type , TO_CHAR(tb_order."createDate" ,'DD-MM-YYYY') as date,
            TO_CHAR(tb_order."createDate" ,'HH24:MI') as time , tb_order_status.name as status
            FROM tb_order
            LEFT JOIN tb_user ON tb_order.user_id = tb_user.id
            LEFT JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
            LEFT JOIN tb_order_status ON tb_order.status = tb_order_status.id
            WHERE EXTRACT(YEAR FROM tb_order."createDate")  = EXTRACT(YEAR FROM CURRENT_DATE)`;

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

//day
//month
//week
//year


module.exports = {
    getOrderAll,
    getOrderbyOrderId,
    getOrderByLastDay,
    getOrderByLastMonth,
    getOrderByLastYear
}