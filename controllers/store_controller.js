//INSERT INTO "public"."tb_machine_case"("name", "detail", "status", "createdate") VALUES ('test', 'zzzz', '0', '2021-02-11 11:33:44') RETURNING *

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

getGasStoreAll = (req , res , next) => {
    sql = `SELECT tb_machine_gas.id , tb_machine_gas.machine_code , tb_machine_gas.name ,
            tb_machine_gas.address_name as address,  tb_machine_gas.type,
            COUNT(tb_machine_gas.id) as order_number,
                CASE WHEN tb_machine_gas.status ='1' THEN 'เปิด'
                        WHEN tb_machine_gas.status ='0' THEN 'ปิด'
                        ELSE 'other'
                END as status 
            FROM tb_machine_gas 
            LEFT JOIN tb_order ON tb_machine_gas.id = tb_order.machine_id
            WHERE tb_machine_gas."isDelete" = '0'
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
                tb_machine_gas.address_name as address, tb_machine_gas.type,
                    CASE WHEN tb_machine_gas.status ='1' THEN 'เปิด'
                            WHEN tb_machine_gas.status ='0' THEN 'ปิด'
                            ELSE 'other'
                    END as status  ,
                tb_order.order_number , tb_order.priceall, 
                send_type , TO_CHAR(tb_order."createDate" ,'DD-MM-YYYY') as date,
                TO_CHAR(tb_order."createDate" ,'HH24:MI') as time , tb_order_status.name as status_order
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
                        address: result.rows[0].address ,
                        type : result.rows[0].type , 
                        status : result.rows[0].status
                    }

                    resData.data.order_list = [] ;
                    for (let i = 0; i < result.rows.length; i++) {
                        resData.data.order_list[i] = await { 
                            order_number : result.rows[i].order_number ,
                            priceall : result.rows[i].priceall ,
                            send_type : result.rows[i].send_type ,
                            dateTime :  result.rows[i].date + " " + result.rows[i].time,
                            status_order : result.rows[i].status_order 
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

getGasStoreNumberAll= (req , res , next) => {
    sql = `SELECT COUNT(id) as online FROM tb_machine_gas
            WHERE tb_machine_gas."isDelete" = '0';`;
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

getGasStoreOnline = (req , res , next) => {
    sql = `SELECT COUNT(id) as online FROM tb_machine_gas
            WHERE tb_machine_gas.status = '1' AND tb_machine_gas."isDelete" = '0';`;
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
    sql = `SELECT COUNT(id) as offline FROM tb_machine_gas
             WHERE tb_machine_gas.status = '0' AND tb_machine_gas."isDelete" = '0'; `;
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

getStoreHaveOrder = (req , res , next) => {
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

getStoreNumberHaveOrder = (req , res , next) => {
    sql = `SELECT COUNT(*) as order_number FROM tb_machine_gas
            LEFT JOIN tb_order ON tb_machine_gas.id = tb_order.machine_id
            WHERE tb_order.status <> 1 AND tb_order.status <> 7 AND tb_order.status <> 8`;
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

// INCOME
getIncomeForLastDay = (req , res , next) => {

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

getIncomeForLastMonth = (req , res , next) => {

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


// INSERT INTO "public"."tb_send_problem_iot"("user_id", "name", "detail", "status", "createdate") VALUES (21, 'ค่าของ IoT', 'ค่าของไอโอทีไม่ขึ้นในแอป', '0', '2021-02-24 15:27:32') RETURNING *
// INSERT INTO "public"."tb_send_problem_machine"("name", "detail", "status", "createdate", "owner_id") VALUES ('ไม่ตจ่าย Gas', 'เครื่องไม่ยอมจำหน่าย gas', '0', '2021-02-24 15:30:49', 1) RETURNING *
module.exports = {
    getGasStoreAll,
    getGasStoreByStoreId ,
    getGasStoreOnline,
    getGasStoreOffline,
    getGasStoreNumberAll,
    getStoreNumberHaveOrder
}

// SELECT COUNT(id) FROM tb_machine_gas
// WHERE tb_machine_gas.status = '1';

// SELECT COUNT(id) FROM tb_machine_gas
// WHERE tb_machine_gas.status = '0' ;


// SELECT * FROM tb_machine_gas
// LEFT JOIN tb_machine_case ON tb_machine_gas.id = tb_machine_case.machine_id