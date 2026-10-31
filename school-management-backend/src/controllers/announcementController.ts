import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Announcement, SchoolEvent } from '../types';

const announcementCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.enum(['Academic', 'Sports', 'Holiday', 'Emergency', 'General']),
  targetAudience: z.enum(['All', 'Teachers', 'Students', 'Parents']),
  author: z.string().min(1),
  publishDate: z.string().min(1),
  priority: z.enum(['Low', 'Medium', 'High']),
});

const eventCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  location: z.string().min(1),
  eventType: z.enum(['Sports', 'Academic', 'Meeting', 'Cultural', 'Holiday']),
  organizer: z.string().min(1),
});

export const getAnnouncements = async (_req: Request, res: Response) => {
  const announcements = db.getAnnouncements();
  return res.json({ success: true, total: announcements.length, data: announcements });
};

export const createAnnouncement = async (req: Request, res: Response) => {
  const data = announcementCreateSchema.parse(req.body);

  const newAnn: Announcement = {
    ...data,
    id: `anc-${Date.now()}`,
  };

  db.addAnnouncement(newAnn);

  return res.status(201).json({
    success: true,
    message: `Announcement "${newAnn.title}" published successfully`,
    data: newAnn,
  });
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateAnnouncement(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  return res.json({
    success: true,
    message: 'Announcement updated successfully',
    data: updated,
  });
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteAnnouncement(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  return res.json({
    success: true,
    message: 'Announcement deleted successfully',
  });
};

export const getEvents = async (_req: Request, res: Response) => {
  const events = db.getEvents();
  return res.json({ success: true, total: events.length, data: events });
};

export const createEvent = async (req: Request, res: Response) => {
  const data = eventCreateSchema.parse(req.body);

  const newEvt: SchoolEvent = {
    ...data,
    id: `evt-${Date.now()}`,
  };

  db.addEvent(newEvt);

  return res.status(201).json({
    success: true,
    message: `Event "${newEvt.title}" added to calendar`,
    data: newEvt,
  });
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteEvent(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  return res.json({
    success: true,
    message: 'Event removed from calendar',
  });
};
