const express = require('express');
const {addReport } = require('../controllers/userController');
const router = express.Router();

router.post('/addReport', addReport);


module.exports = router;
