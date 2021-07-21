const { pool } = require('../dbConfig');
const { generateToken , generateRefreshToken , generateTokenTime} = require('../controllers/webTokenManageController');
const userModel = require('../model/user_model');
const functionForData = require('../function/functionForData');
const moment = require('moment');
const bcrypt = require('bcryptjs');



saltRounds = process.env.SALTROUND_SECRET ;

// Data for response api
let resData = {
    status : "",
    statusCode : 200 ,
    data : ""
}
// varible 
let sql = "" ;


userLogin = (req , res , next) => {

    let dataBody = req.body ;

    let data = {
        user : dataBody.username,
        pwd : dataBody.password
    }
    // console.log(dataLogin)
   

    sql = `SELECT * FROM tb_web_user
            WHERE tb_web_user.username = '${data.user}' 
            AND isdelete = '0'`;
                
        pool.query(
        sql, 
        async (err, result) => {
            if (err) {
                //console.log(err);  
                resData.status = "error";
                resData.statusCode = 200 ;
                resData.data = err;
                res.status(resData.statusCode).json(resData);
            }
            else
            {                
                if(result.rows.length > 0)
                {
                    let match = await bcrypt.compare(dataBody.password, result.rows[0].password);
                    if(match) 
                    {
                        //console.log(result.rows)
                        dataUser = result.rows[0];
                        delete dataUser.password ;
                        let dataGen = {
                            username :dataUser.name ,
                            id : dataUser.id
                        }
                        let accessToken = (result.rows[0].type == "warroom")? await generateTokenTime(dataGen,"7d"): await generateToken(dataGen) ;
                        let refreshToken = await generateRefreshToken(dataGen);

                        resData.status = "success";
                        resData.statusCode = 201 ;
                        resData.data = {
                            user_data : dataUser ,
                            token : {
                                accessToken : accessToken,
                                refreshToken : refreshToken
                            }
                        } ;
                        res.status(resData.statusCode).json(resData);
                    }
                    else {
                        resData.status = "error";
                        resData.statusCode = 200 ;
                        resData.data = "password incorrect" ;
                        res.status(resData.statusCode).json(resData);
                    }
                }
                else {
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "not have username";
                    res.status(resData.statusCode).json(resData);
                }               
            }
        }
    );
}

userLogOut = (req , res , next) => {

}

registerUser = async (req , res , next) => {
    let dataBody = req.body ;
    //console.log(dataBody)
    let dataUser = new userModel.UserRegister();
    

    let pwd = await Math.random().toString(36).substring(6);

    dataUser.name= dataBody.name ;
    dataUser.username =  dataBody.username;
    dataUser.password= await bcrypt.hash(pwd, parseInt(saltRounds));
    dataUser.type = dataBody.type ;
    dataUser.personnelCode = dataBody.personnelCode ;
    dataUser.positionCode = dataBody.positionCode ;
    dataUser.taxIdentificationNumber = dataBody.taxIdentificationNumber ;
    dataUser.birthday = dataBody.birthday ;
    dataUser.province = dataBody.province ;
    dataUser.district = dataBody.district ;
    dataUser.subDistrict = dataBody.subDistrict ;
    dataUser.phone = dataBody.phone ;
    dataUser.salary = dataBody.salary ;
    dataUser.businessLeave = dataBody.businessLeave ;
    dataUser.sickLeave = dataBody.sickLeave ;
    dataUser.createDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    dataUser.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');   
    //console.log(dataUser)

    let checkParameter = await functionForData.funCheckParameterWithOutId(dataUser);
    
    if(checkParameter != "" )
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkParameter +" )";    
        res.status(200).json(resData);
    }
    else
    {     
              
        let sql = `SELECT * FROM "tb_web_user"
                    WHERE username = '${dataUser.username}' 
                    AND isdelete = '0'`;
        console.log(sql)
        pool.query(
            sql, 
            async (err, result) => {
                //console.log(err)
                if (err) {
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "query command error tb_web_user check username: " + err;
                    res.status(resData.statusCode).json(resData);
                }
                else
                {
                    //console.log(result.rows)
                    if(result.rows.length > 0){
                        resData.status = "error";
                        resData.statusCode = 200 ;
                        resData.data = "Duplicate username";
                        res.status(resData.statusCode).json(resData);
                    }
                    else
                    {
                        
                        //${dataUser.}
                        sql = `INSERT INTO "public"."tb_web_user"( "username", "password", "name", "type", "createdate", "modifydate", "isdelete", 
                        "personnelCode", "positionCode", "taxIdentificationNumber", "birthday", "province", "district", "subDistrict", "phone", 
                        "salary", "businessLeave", "sickLeave", "approveDate", "isApproved", "approvedBy") 
                        VALUES ('${dataUser.username}', '${dataUser.password}', '${dataUser.name}', '${dataUser.type}', 
                        '${dataUser.createDate}', '${dataUser.modifyDate}', 0, '${dataUser.personnelCode}', '${dataUser.positionCode}', '${dataUser.taxIdentificationNumber}', 
                        '${dataUser.birthday}', ${dataUser.province}, ${dataUser.district}, ${dataUser.subDistrict}, '${dataUser.phone}', 
                        ${dataUser.salary}, ${dataUser.businessLeave}, ${dataUser.sickLeave}, NULL, 0, NULL) RETURNING *`;
                        //console.log(sql)
                        pool.query(
                            sql, 
                            async (err, result) => 
                            {
                                //console.log(err)
                                if (err) {
                                    //console.log(err);                      
                                    resData.status = "error";
                                    resData.statusCode = 200 ;
                                    resData.data = "query command error tb_web_user insert : " + err;
                                    res.status(400).json(resData);
                                }
                                else
                                {
                                    resData.status = "success";
                                    resData.statusCode = 201 ;
                                    resData.data = "insert complete";
                                    res.status(201).json(resData);  
                                }
                            }
                        );
                    } 
                }
            }
        );  
        
    }
}

changePassword = async (req , res , next) => {
    let data = req.body ;   

     if( data == "" || data == undefined || data == null)
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( user_id , password )";    
        res.status(200).json(resData);
    }
    else {
        //console.log(data.password)
        data.password = await bcrypt.hash(data.password, parseInt(saltRounds));
        sql =  `UPDATE "public"."tb_web_user" SET "password" = '${data.password}' WHERE "id" = ${data.user_id}`;
        //sql = `UPDATE "public"."tb_web_user" SET "password" = '${data.password}' WHERE "id" = ${data.user_id} ;`;
        pool.query(
            sql, 
            (err, result) => {
                //console.log(result); 
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
                    resData.data = "update complete" ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
    


}






module.exports = {
    userLogin,
    userLogOut,
    registerUser,
    changePassword
}




// INSERT INTO "public"."tb_web_user"("id", "username", "password", "name", "type", "createdate", "isdelete") VALUES (1, 'test', '111111', 'test test', 'warroom', '2021-02-04 16:10:45', '0') RETURNING *
// INSERT INTO "public"."tb_web_user"("username", "password", "name", "type", "createdate", "isdelete") VALUES ('admin', '111111', 'test test', 'admin', '2021-02-04 16:12:31', '0') RETURNING *