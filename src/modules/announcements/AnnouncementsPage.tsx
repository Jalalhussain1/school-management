import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Megaphone,
  Plus,
  Calendar,
  Users,
  Edit,
  Trash2,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppButton } from '../../components/common/AppButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { AnnouncementModal } from './AnnouncementModal';
import { Announcement } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, deleteAnnouncement, events } = useSchool();

  const [activeTab, setActiveTab] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const handleOpenAdd = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Announcement) => {
    setSelectedAnnouncement(a);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (a: Announcement) => {
    setDeleteTarget(a);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteAnnouncement(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <Box>
      <AppPageTitle
        title="Announcements & Events"
        subtitle="Campus circulars, notifications, sports fixtures, and academic calendar"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Announcements' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
          >
            Post Announcement
          </AppButton>
        }
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label={`Campus Announcements (${announcements.length})`} />
          <Tab label={`School Event Calendar (${events.length})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Announcements List */}
      {activeTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {announcements.map((anc) => (
            <Card
              key={anc.id}
              sx={{
                borderLeft: '4px solid',
                borderColor:
                  anc.priority === 'High'
                    ? 'error.main'
                    : anc.priority === 'Medium'
                    ? 'primary.main'
                    : 'text.secondary',
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {anc.title}
                    </Typography>
                    <StatusBadge status={anc.category} />
                    <Chip
                      label={`Priority: ${anc.priority}`}
                      size="small"
                      color={anc.priority === 'High' ? 'error' : 'default'}
                      sx={{ fontWeight: 700, height: 22, fontSize: '0.7rem' }}
                    />
                    <Chip
                      label={`Audience: ${anc.targetAudience}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 22, fontSize: '0.7rem' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Notice">
                      <IconButton size="small" onClick={() => handleOpenEdit(anc)}>
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Notice">
                      <IconButton size="small" onClick={() => handleOpenDelete(anc)} sx={{ color: 'error.main' }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Typography variant="body1" color="text.primary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {anc.content}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Issued by: <strong>{anc.author}</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    <Clock size={13} />
                    <Typography variant="caption">{formatDate(anc.publishDate)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Tab 1: School Event Calendar */}
      {activeTab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {events.map((evt) => {
            const startD = new Date(evt.startDate);
            const monthStr = startD.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const dayNum = startD.getDate();

            return (
              <Card key={evt.id} sx={{ p: 2.5, display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2.5,
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 800, lineHeight: 1 }}>
                    {monthStr}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                    {dayNum}
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {evt.title}
                    </Typography>
                    <StatusBadge status={evt.eventType} />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {evt.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', color: 'text.secondary', fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MapPin size={14} color="#2563eb" />
                      <span>{evt.location}</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Users size={14} />
                      <span>Organizer: {evt.organizer}</span>
                    </Box>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Modals */}
      <AnnouncementModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        announcement={selectedAnnouncement}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.title}
        title="Delete Announcement"
      />
    </Box>
  );
};
