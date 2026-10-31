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
} from 'lucide-react';
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
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<School size={16} />} iconPosition="start" label="School Profile" />
          <Tab icon={<Calendar size={16} />} iconPosition="start" label="Academic Session" />
          <Tab icon={<Globe size={16} />} iconPosition="start" label="Preferences & Alerts" />
          <Tab icon={<Palette size={16} />} iconPosition="start" label="Theme & Appearance" />
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
    </Box>
  );
};
