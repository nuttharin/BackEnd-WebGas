const express = require('express');
const router = express.Router();

const {verifyAccessToken , RefreshToken} = require('../controllers/webTokenManageController');




//routes
//endpoint


//GET

//POST
router.post('/refreshToken',RefreshToken)





module.exports = router ;