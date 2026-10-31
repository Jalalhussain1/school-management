import { Request, Response } from 'express';
import { db } from '../database/db';

export const getSettings = async (_req: Request, res: Response) => {
  const settings = db.getSettings();
  return res.json({ success: true, data: settings });
};

export const updateSettings = async (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  return res.json({
    success: true,
    message: 'School settings saved successfully',
    data: updated,
  });
};

export const resetAllData = async (_req: Request, res: Response) => {
  const resetData = db.resetAll();
  return res.json({
    success: true,
    message: 'All system dummy data restored to default',
    data: resetData,
  });
};
