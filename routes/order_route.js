const express = require('express');
const router = express.Router();

const orderControllers = require('../controllers/order_controller');


//routes
//endpoint


//GET
// Order
router.get('/warroom/get/getOrderAll',orderControllers.getOrderAll);
router.get('/warroom/get/getOrderByLastDay',orderControllers.getOrderByLastDay)
router.get('/warroom/get/getOrderByLastMonth',orderControllers.getOrderByLastMonth)
router.get('/warroom/get/getOrderByLastYear',orderControllers.getOrderByLastYear)
router.get('/warroom/get/getOrderbyOrderId',orderControllers.getOrderbyOrderId)

// Diver
router.get('/warroom/get/getOrderAll',orderControllers.getOrderAll)



//POST 




module.exports = router ;