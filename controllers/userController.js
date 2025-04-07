const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user'); // Assuming you have a User model
const util = require('../models/util');
const initializePassport = require('../server/config/passport-config');
const client = util.getMongoClient(false);
// Initialize passport
initializePassport(passport);

// Middleware to check if user is not authenticated
const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
};

// Middleware to check if user is authenticated
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Login Routes
router.get('/login', util.logRequest, checkNotAuthenticated, (req, res) => {
    res.render('login', { 
        user: req.user,
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
});

router.post('/login', util.logRequest, 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

// Logout Route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/');
        }
        req.flash('success', 'You have been logged out successfully');
        res.redirect('/login');
    });
});

// Registration Routes
router.get('/register', util.logRequest, checkNotAuthenticated, (req, res) => {
    console.log(req.flash('error'))
    res.render('register', { 
        user: req.user,
        messages: {
            error: req.flash('error')
        }
    });
});
router.post('/register', util.logRequest, async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;
        const usersCollection = client.db().collection('users');
        console.log("post register", {username, password, confirmPassword})
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/register');
        }
        
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            req.flash('error', 'Username already exists');
            return res.redirect('/register');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            role: 'member'
        });
        
        await util.insertOne(usersCollection, newUser);
        console.log("after registeration:", newUser)
        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Registration failed');
        res.redirect('/register');
    }
});

module.exports = router;