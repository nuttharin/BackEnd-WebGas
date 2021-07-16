const express = require('express');
const router = express.Router();

const generalControllers = require('../controllers/general_controller');




//routes
//endpoint


//GET
router.get('/get/province',generalControllers.getProvince);
router.get('/get/district',generalControllers.getAmphure);
router.get('/get/subDistrict',generalControllers.getDistrict);




//POST
// router.post('/login',userControllers.userLogin)
// router.post('/logOut',userControllers.userLogOut)
// router.post('/register' , userControllers.registerUser)




module.exports = router ;