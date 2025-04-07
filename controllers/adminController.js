const express = require('express');
const router = express.Router();
const util = require('../models/util');
const client = util.getMongoClient(false);

// Middleware to check admin role
const checkAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.flash('error', 'Admin access required');
    res.redirect('/login');
};

// Admin dashboard route
router.get('/admin/dashboard', checkAdmin, async (req, res) => {
    try {
        const collection = client.db().collection('posts');
        const posts = await util.find(collection, {}, { sort: { postedAt: -1 } });
        
        res.render('admin/dashboard', {
            user: req.user,
            posts: posts,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Failed to load posts');
        res.redirect('/admin/dashboard');
    }
});

// Admin delete post route
router.delete('/admin/posts/:id', checkAdmin, async (req, res) => {
    try {
        const collection = client.db().collection('posts');
        const postId = parseInt(req.params.id);
        
        const result = await util.deleteOne(collection, { id: postId });
        
        if (result.deletedCount === 1) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Post not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post" });
    }
});

module.exports = router;