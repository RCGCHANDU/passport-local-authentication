const express = require('express');
const { ensureAuthenticated } = require('../config/required')
const router = express.Router();

router.get('/', (req, res) => {
    return res.render('welcome');
})

router.get('/dashboard',ensureAuthenticated, (req, res) => {
    res.render('dashboard', {name: req.user.name})
})

module.exports = router;