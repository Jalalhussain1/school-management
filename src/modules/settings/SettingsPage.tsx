import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Settings,
  School,
  Calendar,
  Globe,
  Palette,
  RotateCcw,
  Save,
  CheckCircle2,
  Users,
  UserPlus,
  Copy,
  Check,
  ExternalLink,
  Mail,
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
} from '@mui/material';
import { api } from '../../services/api';
import { UserRole } from '../../types/auth';
import { useSchool } from '../../context/SchoolContext';
import { useAppTheme } from '../../context/ThemeContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useSchool();
  const { mode, toggleTheme } = useAppTheme();

  const [activeTab, setActiveTab] = useState(0);

  // User Management & Invitation States
  const [users, setUsers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Teacher' as UserRole,
    designation: '',
  });
  const [inviting, setInviting] = useState(false);
  const [lastGeneratedInvite, setLastGeneratedInvite] = useState<{
    link: string;
    email: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const { showToast } = useSchool();

  const loadUsersAndInvites = () => {
    setLoadingUsers(true);
    Promise.all([api.auth.getUsers(), api.auth.getInvitations()])
      .then(([usersRes, invitesRes]) => {
        if (usersRes.success) setUsers(usersRes.users);
        if (invitesRes.success) setInvitations(invitesRes.invitations);
      })
      .catch(console.error)
      .finally(() => setLoadingUsers(false));
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      showToast('Please enter both name and email', 'error');
      return;
    }
    setInviting(true);
    try {
      const res = await api.auth.inviteUser({
        name: inviteForm.name.trim(),
        email: inviteForm.email.trim(),
        role: inviteForm.role,
        designation: inviteForm.designation.trim() || undefined,
      });

      if (res.success) {
        showToast(`Invitation created & email dispatched for ${inviteForm.email}`, 'success');
        setLastGeneratedInvite({
          link: res.inviteLink,
          email: inviteForm.email,
          name: inviteForm.name,
        });
        setInviteForm({ name: '', email: '', role: 'Teacher', designation: '' });
        loadUsersAndInvites();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to create user invitation', 'error');
    } finally {
      setInviting(false);
    }
  };

  const [formData, setFormData] = useState({
    schoolName: settings.schoolName,
    schoolCode: settings.schoolCode,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    website: settings.website,
    principalName: settings.principalName,
    currentAcademicYear: settings.currentAcademicYear,
    currencySymbol: settings.currencySymbol,
    dateFormat: settings.dateFormat,
    enableEmailNotifications: settings.enableEmailNotifications,
    enableSmsNotifications: settings.enableSmsNotifications,
  });

  const handleSave = () => {
    updateSettings(formData);
  };

  return (
    <Box>
      <AppPageTitle
        title="Institution Settings & Preferences"
        subtitle="Configure school metadata, academic calendar years, communication alerts, and appearance"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Settings' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Save size={16} />}
            onClick={handleSave}
          >
            Save All Settings
          </AppButton>
        }
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => {
            setActiveTab(v);
            if (v === 4) loadUsersAndInvites();
          }}
        >
          <Tab icon={<School size={16} />} iconPosition="start" label="School Profile" />
          <Tab icon={<Calendar size={16} />} iconPosition="start" label="Academic Session" />
          <Tab icon={<Globe size={16} />} iconPosition="start" label="Preferences & Alerts" />
          <Tab icon={<Palette size={16} />} iconPosition="start" label="Theme & Appearance" />
          <Tab icon={<Users size={16} />} iconPosition="start" label="Users & Invitations" />
        </Tabs>
      </Box>

      {/* Tab 0: School Profile */}
      {activeTab === 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Official Institution Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This information appears on student report cards, fee receipts, and official transcripts.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <AppInput
                label="Institution Name"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              />

              <AppInput
                label="School / Accreditation Code"
                value={formData.schoolCode}
                onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
              />

              <AppInput
                label="Official Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <AppInput
                label="Official Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <AppInput
                label="Campus Physical Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <AppInput
                label="Official Website URL"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />

              <AppInput
                label="Principal & Chief Administrator Name"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
              />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <AppButton variant="contained" color="primary" onClick={handleSave}>
                Save Profile Changes
              </AppButton>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tab 1: Academic Session */}
      {activeTab === 1 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Academic Terms & Session Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Active academic year determines active student rosters, attendance ledgers, and grade reports.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <AppDropdown
                label="Current Academic Session"
                value={formData.currentAcademicYear}
                onChange={(e) => setFormData({ ...formData, currentAcademicYear: e.target.value as string })}
                options={[
                  { value: '2026-2027', label: 'Session 2026-2027 (Current Active)' },
                  { value: '2025-2026', label: 'Session 2025-2026 (Archived)' },
                  { value: '2027-2028', label: 'Session 2027-2028 (Upcoming Planning)' },
                ]}
              />

              <AppDropdown
                label="Grading Scale System"
                value="Percentage"
                onChange={() => {}}
                options={[
                  { value: 'Percentage', label: 'Letter Grade & Percentage (A+, A, B, C, F)' },
                  { value: 'GPA4', label: '4.0 GPA Weighted Scale' },
                  { value: 'GPA5', label: '5.0 GPA Honor Scale' },
                ]}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Preferences & Alerts */}
      {activeTab === 2 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Localization & Communication Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Currency symbols, date presentation, and notification triggers.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
              <AppDropdown
                label="Currency Symbol"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value as string })}
                options={[
                  { value: '$', label: '$ (USD / Dollar)' },
                  { value: '€', label: '€ (EUR / Euro)' },
                  { value: '£', label: '£ (GBP / Pound)' },
                  { value: '₹', label: '₹ (INR / Rupee)' },
                ]}
              />

              <AppDropdown
                label="Date Format"
                value={formData.dateFormat}
                onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value as string })}
                options={[
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-10-21)' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (10/21/2026)' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (21/10/2026)' },
                ]}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Automated Notification Triggers
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableEmailNotifications}
                    onChange={(e) => setFormData({ ...formData, enableEmailNotifications: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Email Alerts on Fee Invoicing & Overdue Reminders
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Automatically send automated billing invoices to parent emails.
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableSmsNotifications}
                    onChange={(e) => setFormData({ ...formData, enableSmsNotifications: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      SMS Absence Alerts
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Notify parent mobile numbers immediately when student is marked absent.
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Theme & Appearance */}
      {activeTab === 3 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Theme & System Administration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Toggle display modes and reset session dummy data.
            </Typography>

            <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: 'action.hover', mb: 3 }}>
              <FormControlLabel
                control={<Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Dark Mode Theme ({mode === 'dark' ? 'Active' : 'Disabled'})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Switch between sleek dark interface and crisp daylight canvas.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid rgba(239, 68, 68, 0.3)', bgcolor: 'rgba(239, 68, 68, 0.04)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'error.main', mb: 0.5 }}>
                Reset Mock Data Seed
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Clears any student, attendance, or fee additions created in your local browser session and restores the default comprehensive mock data seed.
              </Typography>
              <AppButton
                variant="outlined"
                color="error"
                icon={<RotateCcw size={16} />}
                onClick={resetAllData}
              >
                Reset All Session Data to Default
              </AppButton>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: User Accounts & Invitations */}
      {activeTab === 4 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  User Management & Invitations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Invite teachers, administrators, students, or parents by email with secure self-setup links.
                </Typography>
              </Box>
              <AppButton
                variant="contained"
                color="primary"
                icon={<UserPlus size={16} />}
                onClick={() => {
                  setLastGeneratedInvite(null);
                  setInviteModalOpen(true);
                }}
              >
                Invite New User
              </AppButton>
            </Box>

            {/* Recent Invitations */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}>
              Pending & Sent Invitations
            </Typography>
            {invitations.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, mb: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No invitations generated yet. Click "Invite New User" above to send your first email invite.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 4 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Invited User</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Assigned Role</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Invitation Link</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invitations.map((inv) => {
                      const link = `${window.location.origin}/setup-account?token=${inv.token}`;
                      return (
                        <TableRow key={inv.id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{inv.name}</TableCell>
                          <TableCell>{inv.email}</TableCell>
                          <TableCell>
                            <Chip label={inv.role} size="small" color={inv.role === 'Admin' ? 'primary' : inv.role === 'Teacher' ? 'secondary' : 'default'} sx={{ fontWeight: 600 }} />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={inv.status}
                              size="small"
                              color={inv.status === 'Accepted' ? 'success' : inv.status === 'Pending' ? 'warning' : 'error'}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {inv.status === 'Pending' ? (
                              <AppButton
                                size="small"
                                variant="outlined"
                                icon={<Copy size={13} />}
                                onClick={() => {
                                  navigator.clipboard.writeText(link);
                                  showToast('Invitation link copied to clipboard!', 'success');
                                }}
                              >
                                Copy Link
                              </AppButton>
                            ) : (
                              <Typography variant="caption" color="text.secondary">Activated</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Active Users Table */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Active Registered Accounts ({users.length})
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Official Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Designation / Scope</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={u.avatar} sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
                            {u.name?.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.designation || u.role}</TableCell>
                      <TableCell>
                        <Chip label={u.role} size="small" color={u.role === 'Admin' ? 'primary' : u.role === 'Teacher' ? 'secondary' : 'default'} sx={{ fontWeight: 700 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Invite User Dialog */}
      <Dialog
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {lastGeneratedInvite ? 'Invitation Email Dispatched!' : 'Invite / Add New User'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {lastGeneratedInvite ? (
            <Box sx={{ py: 1 }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                An invitation email has been sent to <strong>{lastGeneratedInvite.email}</strong>.
              </Alert>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                When <strong>{lastGeneratedInvite.name}</strong> clicks the email link, they will be taken to the secure account setup page to verify their email, set their password, and upload their photo:
              </Typography>

              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, border: 1, borderColor: 'divider', mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  INVITATION URL LINK
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', mb: 2 }}>
                  {lastGeneratedInvite.link}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <AppButton
                    variant="contained"
                    size="small"
                    icon={copied ? <Check size={14} /> : <Copy size={14} />}
                    onClick={() => {
                      navigator.clipboard.writeText(lastGeneratedInvite.link);
                      setCopied(true);
                      showToast('Invite link copied!', 'success');
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? 'Copied Link' : 'Copy Invitation Link'}
                  </AppButton>

                  <AppButton
                    variant="outlined"
                    size="small"
                    icon={<ExternalLink size={14} />}
                    onClick={() => window.open(lastGeneratedInvite.link, '_blank')}
                  >
                    Open Page Preview
                  </AppButton>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSendInvite} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Enter user details below. An automated activation invitation link will be created for them.
              </Typography>

              <AppInput
                label="Full Name"
                placeholder="e.g. Professor David Miller"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                required
              />

              <AppInput
                label="Official Email Address"
                type="email"
                placeholder="e.g. david.miller@school.edu"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                required
              />

              <AppDropdown
                label="Portal Role Permission"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                options={[
                  { value: 'Admin', label: 'Administrator / Principal' },
                  { value: 'Teacher', label: 'Teacher / Faculty Instructor' },
                  { value: 'Student', label: 'Student' },
                  { value: 'Parent', label: 'Parent / Guardian' },
                ]}
              />

              <AppInput
                label="Designation / Title (Optional)"
                placeholder="e.g. Senior Faculty - Mathematics"
                value={inviteForm.designation}
                onChange={(e) => setInviteForm({ ...inviteForm, designation: e.target.value })}
              />

              <DialogActions sx={{ p: 0, pt: 2 }}>
                <AppButton variant="outlined" onClick={() => setInviteModalOpen(false)}>
                  Cancel
                </AppButton>
                <AppButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={inviting}
                  icon={<Mail size={16} />}
                >
                  Send Invitation
                </AppButton>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
        {lastGeneratedInvite && (
          <DialogActions sx={{ p: 2 }}>
            <AppButton variant="contained" onClick={() => setInviteModalOpen(false)}>
              Done
            </AppButton>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};
