//INSERT INTO "public"."tb_machine_case"("name", "detail", "status", "createdate") VALUES ('test', 'zzzz', '0', '2021-02-11 11:33:44') RETURNING *

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

getGasStoreAll = (req , res , next) => {
    sql = `SELECT tb_machine_gas.id , tb_machine_gas.machine_code , tb_machine_gas.name ,
            tb_machine_gas.address_name as address, 
            COUNT(tb_machine_gas.id) as order_number,
                CASE WHEN tb_machine_gas.status ='1' THEN 'เปิด'
                        WHEN tb_machine_gas.status ='0' THEN 'ปิด'
                        ELSE 'other'
                END as status 
            FROM tb_machine_gas 
            LEFT JOIN tb_order ON tb_machine_gas.id = tb_order.machine_id
            GROUP BY tb_machine_gas.id
            ORDER BY tb_machine_gas.id;`;
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

getGasStoreByStoreId = (req , res , next) => {
    let data = req.query.store_id

    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( store_id )";    
        res.status(200).json(resData);
    }   
    else {
        sql = `SELECT tb_machine_gas.id , tb_machine_gas.machine_code , tb_machine_gas.name ,
                tb_machine_gas.address_name as address, 
                    CASE WHEN tb_machine_gas.status ='1' THEN 'เปิด'
                            WHEN tb_machine_gas.status ='0' THEN 'ปิด'
                            ELSE 'other'
                    END as status  ,
                tb_order.order_number , tb_order.priceall, 
                send_type , TO_CHAR(tb_order."createDate" ,'DD-MM-YYYY') as date,
                TO_CHAR(tb_order."createDate" ,'HH24:MI') as time , tb_order_status.name as status 
                FROM tb_machine_gas 
                LEFT JOIN tb_order ON tb_machine_gas.id = tb_order.machine_id
                LEFT JOIN tb_order_status ON tb_order.status = tb_order_status.id            
                WHERE tb_machine_gas.id = ${data} `;
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
                    resData.data = await {
                        id: result.rows[0].id,
                        machine_code: result.rows[0].machine_code ,
                        name: result.rows[0].name ,
                        address: result.rows[0].address 
                    }

                    resData.data.order_list = [] ;
                    for (let i = 0; i < result.rows.length; i++) {
                        resData.data.order_list[i] = await { order_number : result.rows[i].order_number ,
                            priceall : result.rows[i].priceall ,
                            send_type : result.rows[i].send_type ,
                            dateTime :  result.rows[i].date + " " + result.rows[i].time
                        }
                        
                    }
                    //console.log(result.rows)
                    resData.status = "success"; 
                    resData.statusCode = 201 ;
                    //resData.data = result.rows ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }


}

getGasStoreOnlineOffline = (req , res , next) => {
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

getGasStoreOffline = (req , res , next) => {
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


getDetailGasStoreOnlineOffline = (req , res , next) => {
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

module.exports = {
    getGasStoreAll,
    getGasStoreByStoreId ,
    getGasStoreOnlineOffline,
    getDetailGasStoreOnlineOffline
}

// SELECT COUNT(id) FROM tb_machine_gas
// WHERE tb_machine_gas.status = '1';

// SELECT COUNT(id) FROM tb_machine_gas
// WHERE tb_machine_gas.status = '0' ;


// SELECT * FROM tb_machine_gas
// LEFT JOIN tb_machine_case ON tb_machine_gas.id = tb_machine_case.machine_id