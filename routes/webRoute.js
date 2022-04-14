'use strict';
import express from 'express';
import { checkAuthenticated } from '../controllers/loginController';

import { converter, history, index, live, settings } from '../controllers/webController';

const router = express.Router();

router.get('/', checkAuthenticated, index);
router.get('/live', checkAuthenticated, live);
router.get('/history', checkAuthenticated, history);
router.get('/converter', checkAuthenticated, converter);
router.get('/settings', checkAuthenticated, settings);

export default router;