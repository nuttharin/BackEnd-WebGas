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

getUserAppByUserId = async (req , res , next) => {
    let data = req.query.user_id ;
    sql = `SELECT "id" , "name","createDate",email,phone,"type" , "urlPicture" FROM "public"."tb_user" WHERE "isApproved" = 0 AND "isDelete" <> 1 AND id = ${data};`;
    pool.query(
        sql, 
        async (err, result) => {
            //console.log(result.rows); 
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
                
                let urlTemp = JSON.parse(result.rows[0].urlPicture)
                //console.log( urlTemp.cardId)
                delete result.rows[0].urlPicture ;
                result.rows[0].urlPicture = { 
                    cardId : await process.env.IP_ADDRESS_APP + urlTemp.cardId , 
                    cardIdFace : await process.env.IP_ADDRESS_APP + urlTemp.cardIdFace 
                }
                

                resData.data = result.rows[0] ;
                res.status(resData.statusCode).json(resData);
            }
        }
    );
}

getUserListAppForApprove = (req , res , next) => {
    sql = `SELECT "id" , "name","createDate",email,phone,"type" , "urlPicture"FROM "public"."tb_user" WHERE "isApproved" = 0 AND "isDelete" <> 1;`;
    pool.query(
        sql, 
        (err, result) => {
            console.log(result.rows); 
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
                //result.rows
                resData.data = result.rows ;
                res.status(resData.statusCode).json(resData);
            }
        }
    );
}

getUserAppForApproveById = async (req , res , next) => {
    let id = req.query.userAppId ;

    sql = `SELECT "name" , "idCard" , email , phone , "createDate" , "modifyDate"
        , "type", "urlPicture" 
        FROM tb_user WHERE id = ${id};`;

    pool.query(
        sql, 
        async (err, result) => {
            //console.log(result.rows); 
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
                let urlPicture = await JSON.parse(result.rows[0].urlPicture)
                //result.rows[0].urlPicture = await JSON.parse(urlPicture)
                for(var k in urlPicture) {
                    console.log(k, urlPicture[k]);
                    urlPicture[k] =await process.env.IP_ADDRESS_APP + urlPicture[k]
                }
                // delete result.rows[0].urlPicture;
                result.rows[0].urlPicture = await urlPicture
                resData.data = result.rows[0] ;
                res.status(resData.statusCode).json(resData);
            }
        }
    );
}

approveUserForAppById = (req , res , next) => {
    let data = req.body ;
    // data.userWebId
    // data.userAppId
    sql = `UPDATE "public"."tb_user" SET "isApproved" = 1, "approveBy" = ${data.userWebId}  WHERE "id" = ${data.userAppId};`;
    pool.query(
        sql, 
        (err, result) => {
            console.log(result.rows); 
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
//UPDATE "public"."tb_user" SET "isApproved" = 0 WHERE "id" = 30
//SELECT * FROM "public"."tb_user" WHERE "isApproved" = 0


//Driver
getDriverListAppForApprove = (req , res , next) => {
    sql = `SELECT id , "name" "createDate"  ,email  , phone , "urlPicture"  FROM tb_rider
    WHERE "isApproved" = 0 AND "isDelete" <> 1 
    ORDER BY id ;`;
    pool.query(
        sql, 
        (err, result) => {
            console.log(result); 
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

getDriverAppForApproveById = async (req , res , next) => {
    let id = req.query.driverAppId ;

    sql = `SELECT "name" , "idCard" , email , phone , "createDate" , "modifyDate", "urlPicture" 
            FROM tb_rider WHERE id = ${id};`;
    pool.query(
        sql, 
        async (err, result) => {
            //console.log(result.rows); 
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
                let urlPicture = await JSON.parse(result.rows[0].urlPicture)
                //result.rows[0].urlPicture = await JSON.parse(urlPicture)
                for(var k in urlPicture) {
                    console.log(k, urlPicture[k]);
                    urlPicture[k] =await process.env.IP_ADDRESS_APP + urlPicture[k]
                }
                // delete result.rows[0].urlPicture;
                result.rows[0].urlPicture = await urlPicture
                resData.data = result.rows[0] ;
                res.status(resData.statusCode).json(resData);
            }
        }
    );
}

approveDriverForAppById = (req , res , next) => {
    let data = req.body ;
    // data.userWebId
    // data.driverAppId
    //UPDATE "public"."tb_rider" SET "isApproved" = 1, "approveBy" = 1 WHERE "id" = 7
    sql = `UPDATE "public"."tb_rider" SET "isApproved" = 1, "approveBy" = ${data.userWebId} WHERE "id" = ${data.driverAppId};`;
    pool.query(
        sql, 
        (err, result) => {
            console.log(result); 
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

module.exports = {
    getUserAppByUserId, 
    getUserListAppForApprove,
    getUserAppForApproveById,
    approveUserForAppById,
    getDriverListAppForApprove,
    getDriverAppForApproveById,
    approveDriverForAppById

}