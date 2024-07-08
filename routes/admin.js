var express = require('express');
var router = express.Router();

const { login } = require('../controllers/auth.controllers');

router.post('/login', login);

module.exports = router;
