const util = require('../models/util.js')
const express = require('express')
const config = require("../server/config/config")

const homeController = express.Router()

// homeController.use('/', checkAuthenticated);
// homeController.use('/about', checkAuthenticated);



homeController.get('/', util.logRequest, (req, res) => {
    res.render('index', {
        user: req.user,  // Pass user data if available
        title: "Home Page"
    })
})


homeController.get('/about', util.logRequest, (req, res) => {
    res.render('about', {
        user: req.user,  // Pass user data if available
        title: "Home Page"
    })
})


module.exports = homeController