'use strict';
import express from 'express';
import multer from 'multer';
import { changeActiveFile, loadCanList, loadFileNames, deleteDbcFile, downloadDbcFile } from '../controllers/dbcFileController';
import { checkAuthenticated, checkAuthorized } from '../controllers/loginController';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './db/dbcFiles');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, originalname);
    }
})

const upload = multer({ storage })

const router = express.Router();

// FIXME: Move file uploading to ../controllers/dbcFileController
router.post('/uploadDBC', checkAuthorized, upload.single('dbcFile'), (req, res) => {
    return res.json({ status: 'saved' });
});

router.get('/getDbcFiles', checkAuthenticated, loadFileNames);
router.get('/changeDbcFile', checkAuthorized, changeActiveFile);
router.get('/loadCanList', checkAuthenticated, loadCanList);
router.delete('/deleteDbcFile', checkAuthorized, deleteDbcFile);
router.get('/downloadDbcFile', checkAuthenticated, downloadDbcFile);


export default router;