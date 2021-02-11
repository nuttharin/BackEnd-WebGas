const express = require('express');
const router = express.Router();

const diverControllers = require('../controllers/diver_controller');


//routes
//endpoint


//GET
// Order
router.get('/warroom/get/getDiverDetailByDiverId',diverControllers.getDiverDetailByDiverId);


// Diver
// router.get('',orderControllers.getOrderAll)



//POST 




module.exports = router ;