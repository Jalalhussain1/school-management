import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Vehicle, TransportRoute } from '../types';

const vehicleCreateSchema = z.object({
  vehicleNumber: z.string().min(1),
  registrationNumber: z.string().min(1),
  vehicleModel: z.string().min(1),
  capacity: z.number().int().positive(),
  driverName: z.string().min(1),
  driverPhone: z.string().min(1),
  driverLicense: z.string().min(1),
  routeName: z.string().min(1),
  status: z.enum(['Active', 'Maintenance', 'Inactive']),
});

const routeCreateSchema = z.object({
  routeName: z.string().min(1),
  vehicleId: z.string().min(1),
  vehicleNumber: z.string().min(1),
  startPoint: z.string().min(1),
  endPoint: z.string().min(1),
  stopsCount: z.number().int().nonnegative(),
  morningPickupTime: z.string().min(1),
  afternoonDropTime: z.string().min(1),
  monthlyFee: z.number().nonnegative(),
  assignedStudentsCount: z.number().int().nonnegative(),
});

export const getVehicles = async (_req: Request, res: Response) => {
  const vehicles = db.getVehicles();
  return res.json({ success: true, total: vehicles.length, data: vehicles });
};

export const getVehicleById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const vehicle = db.getVehicleById(id);

  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  return res.json({ success: true, data: vehicle });
};

export const createVehicle = async (req: Request, res: Response) => {
  const data = vehicleCreateSchema.parse(req.body);

  const newVehicle: Vehicle = {
    ...data,
    id: `veh-${Date.now()}`,
  };

  db.addVehicle(newVehicle);

  return res.status(201).json({
    success: true,
    message: `Vehicle ${newVehicle.vehicleNumber} added successfully`,
    data: newVehicle,
  });
};

export const updateVehicle = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateVehicle(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  return res.json({
    success: true,
    message: 'Vehicle updated successfully',
    data: updated,
  });
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteVehicle(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  return res.json({
    success: true,
    message: 'Vehicle deleted successfully',
  });
};

export const getRoutes = async (_req: Request, res: Response) => {
  const routes = db.getRoutes();
  return res.json({ success: true, total: routes.length, data: routes });
};

export const getRouteById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const route = db.getRouteById(id);

  if (!route) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  return res.json({ success: true, data: route });
};

export const createRoute = async (req: Request, res: Response) => {
  const data = routeCreateSchema.parse(req.body);

  const newRoute: TransportRoute = {
    ...data,
    id: `rt-${Date.now()}`,
  };

  db.addRoute(newRoute);

  return res.status(201).json({
    success: true,
    message: `Route "${newRoute.routeName}" added successfully`,
    data: newRoute,
  });
};

export const updateRoute = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateRoute(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  return res.json({
    success: true,
    message: 'Route updated successfully',
    data: updated,
  });
};

export const deleteRoute = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteRoute(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  return res.json({
    success: true,
    message: 'Route deleted successfully',
  });
};
