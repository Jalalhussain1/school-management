import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { Vehicle } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface VehicleModalProps {
  open: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ open, onClose, vehicle }) => {
  const { addVehicle, updateVehicle } = useSchool();
  const isEditing = Boolean(vehicle);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    registrationNumber: '',
    vehicleModel: '',
    capacity: 40,
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    routeName: '',
    status: 'Active' as 'Active' | 'Maintenance' | 'Inactive',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber,
        registrationNumber: vehicle.registrationNumber,
        vehicleModel: vehicle.vehicleModel,
        capacity: vehicle.capacity,
        driverName: vehicle.driverName,
        driverPhone: vehicle.driverPhone,
        driverLicense: vehicle.driverLicense,
        routeName: vehicle.routeName,
        status: vehicle.status,
      });
    } else {
      setFormData({
        vehicleNumber: `BUS-0${Math.floor(5 + Math.random() * 5)}`,
        registrationNumber: 'MA-331-XY',
        vehicleModel: 'Thomas Saf-T-Liner (44 Seater)',
        capacity: 44,
        driverName: '',
        driverPhone: '',
        driverLicense: 'CDL-COMM-1092',
        routeName: 'Route 1 - North Express',
        status: 'Active',
      });
    }
    setErrors({});
  }, [vehicle, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.vehicleNumber.trim()) errs.vehicleNumber = 'Vehicle number is required';
    if (!formData.driverName.trim()) errs.driverName = 'Driver name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && vehicle) {
      updateVehicle(vehicle.id, formData);
    } else {
      addVehicle(formData);
    }
    onClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Vehicle: ${vehicle?.vehicleNumber}` : 'Add Campus Vehicle'}
      subtitle="Fleet management and driver assignment"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Vehicle'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Vehicle ID / Bus No"
            required
            value={formData.vehicleNumber}
            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            placeholder="e.g. BUS-05"
            error={Boolean(errors.vehicleNumber)}
            helperText={errors.vehicleNumber}
          />
          <AppInput
            label="Registration Number"
            value={formData.registrationNumber}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            placeholder="e.g. MA-774-XY"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
          <AppInput
            label="Vehicle Model & Make"
            value={formData.vehicleModel}
            onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
            placeholder="e.g. Blue Bird 48 Seater"
          />
          <AppInput
            label="Seating Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Driver Name"
            required
            value={formData.driverName}
            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            placeholder="Full Name"
            error={Boolean(errors.driverName)}
            helperText={errors.driverName}
          />
          <AppInput
            label="Driver Contact Phone"
            value={formData.driverPhone}
            onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Driver License ID"
            value={formData.driverLicense}
            onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
            placeholder="CDL-COMM-892"
          />

          <AppDropdown
            label="Vehicle Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Maintenance' | 'Inactive' })}
            options={[
              { value: 'Active', label: 'Active & In Service' },
              { value: 'Maintenance', label: 'Under Maintenance' },
              { value: 'Inactive', label: 'Inactive / Standby' },
            ]}
          />
        </Box>

        <AppInput
          label="Assigned Route Name"
          value={formData.routeName}
          onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
          placeholder="e.g. Route 1 - North Cambridge Express"
        />
      </Box>
    </AppModal>
  );
};
