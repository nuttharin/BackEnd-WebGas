const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user_controller');




//routes
//endpoint


//GET

//POST
router.post('/login',userControllers.userLogin)
router.post('/logOut',userControllers.userLogOut)
router.post('/register' , userControllers.registerUser)




module.exports = router ;