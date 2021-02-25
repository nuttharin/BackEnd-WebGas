const express = require('express');
const router = express.Router();

const problemControllers = require('../controllers/problem_controller');




//routes
//endpoint


//GET

//POST
router.get('/warroom/get/getProblemAll',problemControllers.getProblemAll);
router.get('/warroom/get/getProblemInMachine',problemControllers.getProblemInMachine);
router.get('/warroom/get/getProblemInIoT',problemControllers.getProblemInIoT);

// router.post('/warroom/get/' , userControllers.registerUser)




module.exports = router ;