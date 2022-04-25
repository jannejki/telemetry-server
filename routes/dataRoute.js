'use strict';
import express from 'express';
import { calculateValue, getHistory } from '../controllers/dataController.js';
import { checkAuthenticated } from '../controllers/loginController.js';

const router = express.Router();

router.get('/history', checkAuthenticated, getHistory);
router.get('/calculateValue', checkAuthenticated, calculateValue);

export default router;