'use strict';
import express from 'express';
import { loginCredentials, loginPage, logout, newUser, addNewUser } from '../controllers/loginController';

const router = express.Router();

router.get('/', loginPage);
router.post('/', loginCredentials);
router.get('/newUser', newUser);
router.post('/newUser', addNewUser);
router.get('/logout', logout);

export default router;