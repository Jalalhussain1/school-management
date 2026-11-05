import { Router } from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getEvents,
  createEvent,
  deleteEvent,
} from '../controllers/announcementController';
import { optionalAuth, authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

// All roles can read announcements and events
router.get('/announcements', optionalAuth, getAnnouncements);
router.get('/events', optionalAuth, getEvents);

// Only Admin can create/update/delete announcements and events
router.post('/announcements', authenticateToken, requireRoles('Admin'), createAnnouncement);
router.put('/announcements/:id', authenticateToken, requireRoles('Admin'), updateAnnouncement);
router.delete('/announcements/:id', authenticateToken, requireRoles('Admin'), deleteAnnouncement);

router.post('/events', authenticateToken, requireRoles('Admin'), createEvent);
router.delete('/events/:id', authenticateToken, requireRoles('Admin'), deleteEvent);

export default router;
