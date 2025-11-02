import { Router } from 'express';
//import { body } from 'express-validator';

import * as userController from '../controllers/userController';
import { isAuth } from '../middleware/is-Auth';
//import validate from '../middleware/validate';

const router = Router();

/*
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
*/
router.delete('/me', isAuth, userController.deleteSelf);

export default router;
