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


getProblemInMachine =  (req , res , next) => {
    sql = `SELECT tb_send_problem_machine.name , tb_send_problem_machine.detail , tb_send_problem_machine.createDate ,
            CASE WHEN tb_send_problem_machine.status ='0' THEN 'รับแจ้ง'
                    WHEN tb_send_problem_machine.status ='1' THEN 'กำลังแก้ไข'
                    ELSE 'แก้ไขสำเร็จ'
            END as status  , tb_send_problem_machine.owner_id, tb_machine_gas."id" as machine_id,
            tb_machine_gas.machine_code
            , tb_send_problem_machine."codeProblem"
            FROM tb_send_problem_machine
            LEFT JOIN tb_machine_gas ON tb_machine_gas."id" = tb_send_problem_machine.machine_id`;
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

getProblemInIoT = (req , res , next) => {
    sql = `SELECT name , detail , createDate ,
                CASE WHEN status ='0' THEN 'รับแจ้ง'
                        WHEN status ='1' THEN 'กำลังแก้ไข'
                ELSE 'แก้ไขสำเร็จ'
            END as status, tb_send_problem_iot.user_id ,tb_register_iot.id 
            , tb_register_iot."serialNumber" as iot_code , tb_send_problem_iot."codeProblem"
            FROM tb_send_problem_iot
            LEFT JOIN tb_register_iot ON tb_send_problem_iot."iot_id" = tb_register_iot."id"`;
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

getProblemAll = async (req , res , next) => {
    sql = `SELECT name , detail , createDate ,
                CASE WHEN status ='0' THEN 'รับแจ้ง'
                        WHEN status ='1' THEN 'กำลังแก้ไข'
                ELSE 'แก้ไขสำเร็จ'
            END as status, tb_send_problem_iot.user_id ,tb_register_iot.id 
            , tb_register_iot."serialNumber" as iot_code , tb_send_problem_iot."codeProblem"
            FROM tb_send_problem_iot
            LEFT JOIN tb_register_iot ON tb_send_problem_iot."iot_id" = tb_register_iot."id"`;
    pool.query(
        sql, 
        async (err, result1) => {

            if (err) {
                //console.log(err); 
                resData.status = "error"; 
                resData.statusCode = 200 ;
                resData.data = err ;
                res.status(resData.statusCode).json(resData)
            }
            else
            {    
                sql = `SELECT tb_send_problem_machine.name , tb_send_problem_machine.detail ,
                         tb_send_problem_machine.createDate ,
                        CASE WHEN tb_send_problem_machine.status ='0' THEN 'รับแจ้ง'
                                WHEN tb_send_problem_machine.status ='1' THEN 'กำลังแก้ไข'
                                ELSE 'แก้ไขสำเร็จ'
                        END as status  , tb_send_problem_machine.owner_id, tb_machine_gas."id" as machine_id,
                        tb_machine_gas.machine_code
                        , tb_send_problem_machine."codeProblem"
                        FROM tb_send_problem_machine
                        LEFT JOIN tb_machine_gas ON tb_machine_gas."id" = tb_send_problem_machine.machine_id`;
                pool.query(
                    sql, 
                    async (err, result2) => {

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
                            resData.data = await {
                                machine : result1.rows ,
                                iot : result2.rows
                            } ;
                            // resData.data = await result1.rows.concat(result2.rows) ;
                            res.status(resData.statusCode).json(resData);
                        }
                    }
                );
            }
        }
    );
}

// SELECT name , detail , createDate ,
// 			CASE WHEN status ='0' THEN 'รับแจ้ง'
// 							 WHEN status ='1' THEN 'กำลังแก้ไข'
// 							 ELSE 'แก้ไขสำเร็จ'
// 			 END as status  ,user_id FROM tb_send_problem_iot

// SELECT name , detail , createDate ,
// 			CASE WHEN status ='0' THEN 'รับแจ้ง'
// 							 WHEN status ='1' THEN 'กำลังแก้ไข'
// 							 ELSE 'แก้ไขสำเร็จ'
// 			 END as status  , owner_id FROM tb_send_problem_machine


module.exports = {
    getProblemAll,
    getProblemInMachine ,
    getProblemInIoT,
    getProblemAll
}