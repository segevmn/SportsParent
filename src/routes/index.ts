import { Router } from 'express';

import authRoutes from './authRoute';
import userRoutes from './userRoute';
import adminRoutes from './adminRoute';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

export default router;
