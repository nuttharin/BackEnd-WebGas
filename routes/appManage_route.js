const express = require('express');
const router = express.Router();

const appManageControllers = require('../controllers/appManage_controller');

router.get("/user/get/getUserListAppForApprove",appManageControllers.getUserListAppForApprove);
router.get("/user/get/getUserAppForApproveById",appManageControllers.getUserAppForApproveById);
router.post("/user/get/approveUserForAppById",appManageControllers.approveUserForAppById);

router.get("/driver/get/getDriverListAppForApprove",appManageControllers.getDriverListAppForApprove);
router.get("/driver/get/getDriverAppForApproveById",appManageControllers.getDriverAppForApproveById);
router.post("/driver/get/approveDriverForAppById",appManageControllers.approveDriverForAppById);

module.exports = router ;