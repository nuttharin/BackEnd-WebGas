const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user_controller');




//routes
//endpoint


//GET

//POST
router.post('/login',userControllers.userLogin)
router.post('/logOut',userControllers.userLogOut)
router.post('/post/register' , userControllers.registerUser)
router.post('/post/changePassword' , userControllers.changePassword)




module.exports = router ;