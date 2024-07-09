var express = require('express');
var router = express.Router();

const {
	login,
	getAdminData,
	logout
} = require('../controllers/auth.controllers');
const { restrict } = require('../middlewares/restrict');

router.post('/login', login);
router.get('/admin_data', restrict, getAdminData);
router.post('/logout', restrict, logout);

module.exports = router;
