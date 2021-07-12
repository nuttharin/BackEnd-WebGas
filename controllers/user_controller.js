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
    let dataUser = new userModel.User();
    //let dataAddress = new Position();
  

    dataUser.name= dataBody.name ;
    dataUser.username =  dataBody.username;
    dataUser.password= dataBody.password ;
    dataUser.type = dataBody.type ;


    dataUser.createDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    dataUser.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss'); 
    
    


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
        let sql = `SELECT * FROM tb_web_user
                    WHERE username = '${dataUser.username}' 
                    AND isdelete = '0'`;
        pool.query(
            sql, 
            async (err, result) => {
                //console.log(err)
                if (err) {
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "query command error : " + err;
                    res.status(resData.statusCode).json(resData);
                }
                else
                {
                    console.log(result.rows)
                    if(result.rows.length > 0){
                        resData.status = "error";
                        resData.statusCode = 200 ;
                        resData.data = "Duplicate username";
                        res.status(resData.statusCode).json(resData);
                    }
                    else
                    {
                        dataUser.password = await bcrypt.hash(dataBody.password , parseInt(saltRounds));
                        console.log(dataUser.password)
                        sql = `INSERT INTO "public"."tb_web_user"("username", "password", "name", "type", "createdate", "modifydate" ,"isdelete") 
                                VALUES ('${dataUser.username}', '${dataUser.password}',
                                '${dataUser.name}', '${dataUser.type}',
                                '${dataUser.createDate}', '${dataUser.modifyDate}' , '0') RETURNING *`;
                        // console.log(sql)
                        pool.query(
                            sql, 
                            async (err, result) => 
                            {
                                //console.log(err)
                                if (err) {
                                    //console.log(err);                      
                                    resData.status = "error";
                                    resData.statusCode = 200 ;
                                    resData.data = "query command error tb_user: " + err;
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






module.exports = {
    userLogin,
    userLogOut,
    registerUser
}




// INSERT INTO "public"."tb_web_user"("id", "username", "password", "name", "type", "createdate", "isdelete") VALUES (1, 'test', '111111', 'test test', 'warroom', '2021-02-04 16:10:45', '0') RETURNING *
// INSERT INTO "public"."tb_web_user"("username", "password", "name", "type", "createdate", "isdelete") VALUES ('admin', '111111', 'test test', 'admin', '2021-02-04 16:12:31', '0') RETURNING *