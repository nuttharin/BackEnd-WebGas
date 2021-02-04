const { pool } = require('../dbConfig');


// Data for response api
let resData = {
    status : "",
    statusCode : 200 ,
    data : ""
}
// varible 
let sql = "" ;


userLogin = () => {
    // let dataBody = req.body ;
    // let dataLogin = {
    //     user : dataBody.username,
    //     pwd : dataBody.password
    // }
    // // console.log(dataLogin)
    // let resData = {
    //     status : "",
    //     statusCode : 200,
    //     data : ""
    // }     

    // let sql = `SELECT * FROM tb_user
    //             WHERE tb_user.email = '${dataLogin.user}'
    //             AND tb_user."isDelete" = 0 
    //             AND tb_user."isApproved" = 1`;
    // pool.query(
    //     sql, 
    //     async (err, result) => {

    //         if (err) {
    //             //console.log(err);  
    //             resData.status = "error";
    //             resData.statusCode = 200 ;
    //             resData.data = err;
    //             res.status(400).json(resData);
    //         }
    //         else
    //         {                
    //             if(result.rows.length > 0)
    //             {
    //                 let match = await bcrypt.compare(dataBody.password, result.rows[0].password);
    //                 if(match) 
    //                 {
    //                     //console.log(result.rows)
    //                     dataUser = result.rows[0];
    //                     delete dataUser.password ;
    //                     let dataGen = {
    //                         username :dataUser.email ,
    //                         id : dataUser.id
    //                     }
    //                     let accessToken = await generateToken(dataGen);
    //                     let refreshToken = await generateRefreshToken(dataGen);

    //                     resData.status = "success";
    //                     resData.statusCode = 201 ;
    //                     resData.data = {
    //                         user_data : dataUser ,
    //                         token : {
    //                             accessToken : accessToken,
    //                             refreshToken : refreshToken
    //                         }
    //                     } ;
    //                     res.status(200).json(resData);
    //                 }
    //                 else{
    //                     resData.status = "error";
    //                     resData.statusCode = 200 ;
    //                     resData.data = [];
    //                     res.status(200).json(resData);
    //                 }
    //             }
    //             else{
    //                 resData.status = "error";
    //                 resData.statusCode = 200 ;
    //                 resData.data = "not have username";
    //                 res.status(resData.statusCode).json(resData);
    //             }
               
    //         }
    //     }
    // );
}

userLogOut = () => {

}





module.exports = {
    userLogin,
    userLogOut
}