'use strict';
import express from 'express';

import { converter, history, index, live, settings } from '../controllers/webController';

const router = express.Router();

router.get('/', index);
router.get('/live', live);
router.get('/history', history);
router.get('/converter', converter);
router.get('/settings', settings);

export default router;