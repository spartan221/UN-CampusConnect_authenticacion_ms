import { Router } from 'express';
const router = Router();
import { authJwt } from '../middlewares';


import * as userController from '../controllers/user.controller';


router.get('/myInfo', authJwt.verifyToken, userController.getMyPersonalInfo);

router.get('/emails', userController.getEmails);

router.get('/external', userController.getExternalUsers);

router.get('/', [ authJwt.verifyToken, authJwt.isAdmin], userController.getUsers);

router.delete('/', authJwt.verifyToken, userController.unsubscribe);

router.get('/:id',  userController.getUserInfo);

export default router;