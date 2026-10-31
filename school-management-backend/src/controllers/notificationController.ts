import { Request, Response } from 'express';
import { db } from '../database/db';

export const getNotifications = async (_req: Request, res: Response) => {
  const notifications = db.getNotifications();
  return res.json({ success: true, total: notifications.length, data: notifications });
};

export const markNotificationRead = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.markNotificationRead(id);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  return res.json({ success: true, message: 'Notification marked as read', data: updated });
};

export const clearAllNotifications = async (_req: Request, res: Response) => {
  const allRead = db.clearAllNotifications();
  return res.json({ success: true, message: 'All notifications cleared', data: allRead });
};
