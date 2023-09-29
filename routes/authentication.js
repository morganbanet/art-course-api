const express = require('express');

const { register } = require('../controllers/authentication');

router = express.Router();

router.route('/register').post(register);

module.exports = router;
