require('dotenv').config();
const util = require('../models/util.js');
const express = require('express');
const config = require('../server/config/config');

const aiController = express.Router();

// DeepSeek API Configuration
const DEEPSEEK_API_KEY = process.env.AI_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // Verify correct endpoint

aiController.get('/ai', util.logRequest, (req, res) => {
    res.sendFile('ai.html', {root: config.ROOT})
});

const getDeepSeekResponse = async (prompt) => {
    const requestBody = {
        model: 'deepseek-chat', // Use appropriate DeepSeek model
        messages: [{
            role: 'user',
            content: prompt
        }],
        temperature: 0.7,
        max_tokens: 2000
    };

    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        throw error;
    }
};

// GET endpoint for testing
aiController.get('/api/ai', async (req, res) => {
    try {
        const prompt = 'Write a Python function to reverse a string.';
        const content = await getDeepSeekResponse(prompt);
        res.status(200).json({ content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            details: error.message 
        });
    }
});

// POST endpoint for actual queries
aiController.post('/api/ai', async (req, res) => {
    try {
        if (!req.body.prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const content = await getDeepSeekResponse(req.body.prompt);
        res.status(200).json({ content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to process your request',
            details: error.message 
        });
    }
});

module.exports = aiController;