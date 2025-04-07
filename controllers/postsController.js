const util = require('../models/util.js');
const config = require("../server/config/config.js");
const Post = require("../models/post.js");
const client = util.getMongoClient(false);
const express = require('express');
const postsController = express.Router();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Get all posts (API endpoint)
postsController.get('/posts', util.logRequest, async (req, res) => {
    try {
        const collection = client.db().collection('posts');
        const posts = await util.find(collection, {});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get single post
postsController.get('/posts/:id', util.logRequest, async (req, res) => {
    try {
        const collection = client.db().collection('posts');
        const post = (await util.find(collection, {id: parseInt(req.params.id)}))[0];

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: "Post not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get user's posts
postsController.get('/userPosts', util.logRequest, checkAuthenticated, async (req, res) => {
    try {
        const collection = client.db().collection('posts');
        const posts = await util.find(collection, { "Posted By": req.user.username });
        
        res.render('userPosts', {
            user: req.user,
            posts: posts,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Failed to load your posts');
        res.redirect('/');
    }
});

// Render post message form
postsController.get('/postMessage', util.logRequest, checkAuthenticated, (req, res) => {
    res.render('postMessage', { 
        user: req.user,
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
});

// Handle post submission
postsController.post('/addPost', util.logRequest, checkAuthenticated, async (req, res) => {
    try {
        const { topic, message, by } = req.body;
        const collection = client.db().collection('posts');
        
        const post = Post(topic, message, by);
        await util.insertOne(collection, post);
        
        req.flash('success', 'Post created successfully!');
        res.redirect('/userPosts');
    } catch (error) {
        req.flash('error', 'Failed to create post');
        res.redirect('/postMessage');
    }
});

// Delete post
postsController.delete('/posts/:id', util.logRequest, checkAuthenticated, async (req, res) => {
    try {
        const collection = client.db().collection('posts');
        await util.deleteOne(collection, { id: parseInt(req.params.id) });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post" });
    }
});

module.exports = postsController;