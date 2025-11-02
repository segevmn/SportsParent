import { Router } from 'express';

import * as adminController from '../controllers/adminController';
import { isAuth } from '../middleware/is-Auth';
import requireRole from '../middleware/requireRole';

const router = Router();

/*
router.get('/', adminController.getAdmins);
router.post('/', adminController.createAdmin);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
*/

router.delete(
  '/users/:id',
  isAuth,
  requireRole('admin'),
  adminController.deleteUser,
);

export default router;
