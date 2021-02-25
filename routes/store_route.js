const express = require('express');
const router = express.Router();

const storeControllers = require('../controllers/store_controller');



//routes
//endpoint


//GET
// Order
router.get('/warroom/get/getGasStoreAll',storeControllers.getGasStoreAll);
router.get('/warroom/get/getGasStoreByStoreId',storeControllers.getGasStoreByStoreId);
router.get('/warroom/get/getGasStoreOnline' , storeControllers.getGasStoreOnline);
router.get('/warroom/get/getGasStoreOffline' , storeControllers.getGasStoreOffline);
router.get('/warroom/get/getGasStoreNumberAll' , storeControllers.getGasStoreNumberAll);
router.get('/warroom/get/getStoreNumberHaveOrder', storeControllers.getStoreNumberHaveOrder);
// router.get()

// Diver
// router.get('',orderControllers.getOrderAll)



//POST 




module.exports = router ;