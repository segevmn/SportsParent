import { Router } from 'express';

import * as adminController from '../controllers/adminController';
import { isAuth } from '../middleware/is-Auth';
import requireRole from '../middleware/requireRole';
import validate from '../middleware/validate';
import { body, param } from 'express-validator';
import { ROLES_ARRAY } from '../constants/roles';

const router = Router();

router.delete(
  '/users/:id',
  isAuth,
  requireRole('admin'),
  adminController.deleteUser,
);

router.patch(
  '/roles/:id',
  isAuth,
  requireRole('admin'),
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('role').isIn(ROLES_ARRAY).withMessage('Invalid role'),
  ],
  validate,
  adminController.updateUserRole,
);

router.post(
  '/verify-coach/:id',
  isAuth,
  requireRole('admin'),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  adminController.verifyCoach,
);

router.post(
  '/verify-scout/:id',
  isAuth,
  requireRole('admin'),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  adminController.verifyScout,
);

export default router;
