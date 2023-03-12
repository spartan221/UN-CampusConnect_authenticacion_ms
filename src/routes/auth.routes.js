import { Router } from 'express';
const router = Router();
import { authFields } from '../middlewares';

import * as authController from '../controllers/auth.controller';


router.post('/signup', [authFields.isEmailAlreadyInUse, authFields.isUsernameAlreadyInUse], authController.signup);
router.post('/signin', authController.signin);
router.get('/confirm-email/:tokenId', authController.confirmEmail);
router.post('/resend-email', authController.resendEmail);

export default router;