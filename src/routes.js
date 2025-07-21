const express = require('express');
const { login } = require('./auth');
const { recoverPassword } = require('./passwordRecovery');

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials or blocked
 */
router.post('/login', login);

/**
 * @swagger
 * /recover:
 *   post:
 *     summary: Password recovery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password recovery instructions sent
 *       404:
 *         description: User not found
 */
router.post('/recover', recoverPassword);

module.exports = router;
