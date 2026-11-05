import { Router } from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from '../controllers/transportController';
import { optionalAuth, authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

// All roles can view vehicles and routes
router.get('/vehicles', optionalAuth, getVehicles);
router.get('/vehicles/:id', optionalAuth, getVehicleById);
router.get('/routes', optionalAuth, getRoutes);
router.get('/routes/:id', optionalAuth, getRouteById);

// Only Admin can manage vehicles and routes
router.post('/vehicles', authenticateToken, requireRoles('Admin'), createVehicle);
router.put('/vehicles/:id', authenticateToken, requireRoles('Admin'), updateVehicle);
router.delete('/vehicles/:id', authenticateToken, requireRoles('Admin'), deleteVehicle);

router.post('/routes', authenticateToken, requireRoles('Admin'), createRoute);
router.put('/routes/:id', authenticateToken, requireRoles('Admin'), updateRoute);
router.delete('/routes/:id', authenticateToken, requireRoles('Admin'), deleteRoute);

export default router;
