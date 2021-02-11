const express = require('express');
const router = express.Router();

const orderControllers = require('../controllers/store_controller');



//routes
//endpoint


//GET
// Order
router.get('/warroom/get/getGasStoreAll',orderControllers.getGasStoreAll);

router.get('/warroom/get/getGasStoreByStoreId',orderControllers.getGasStoreByStoreId);

// Diver
// router.get('',orderControllers.getOrderAll)



//POST 




module.exports = router ;