'use strict';
import express from 'express';
import { checkAuthenticated, checkAuthorized } from '../controllers/loginController';

import { addNewUser, converter, history, index, live, settings, users } from '../controllers/webController';

const router = express.Router();

router.get('/', checkAuthenticated, index);
router.get('/live', checkAuthenticated, live);
router.get('/history', checkAuthenticated, history);
router.get('/converter', checkAuthenticated, converter);
router.get('/settings', checkAuthenticated, settings);
router.get('/users', checkAuthorized, users);
router.post('/newUser', checkAuthorized, addNewUser);

export default router;