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
  Truck,
  Plus,
  Phone,
  Navigation,
  Clock,
  DollarSign,
  Users,
  Edit,
  Trash2,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppButton } from '../../components/common/AppButton';
import { AppTable, Column } from '../../components/common/AppTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { VehicleModal } from './VehicleModal';
import { Vehicle, TransportRoute } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const TransportPage: React.FC = () => {
  const { vehicles, routes, deleteVehicle } = useSchool();

  const [activeTab, setActiveTab] = useState(0);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setIsVehicleModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setSelectedVehicle(v);
    setIsVehicleModalOpen(true);
  };

  const handleOpenDelete = (v: Vehicle) => {
    setDeleteTarget(v);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteVehicle(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const vehicleColumns: Column<Vehicle>[] = [
    {
      id: 'vehicle',
      label: 'Vehicle / Bus ID',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <Truck size={20} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {row.vehicleNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Plate: {row.registrationNumber}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'model',
      label: 'Model & Make',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.vehicleModel}
        </Typography>
      ),
    },
    {
      id: 'capacity',
      label: 'Capacity',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {row.capacity} Seats
        </Typography>
      ),
    },
    {
      id: 'driver',
      label: 'Assigned Driver',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.driverName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <Phone size={12} />
            <Typography variant="caption">{row.driverPhone}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'route',
      label: 'Route Assigned',
      render: (row) => (
        <Chip
          label={row.routeName || 'Unassigned'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, height: 22, fontSize: '0.725rem' }}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="Edit Vehicle">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'text.secondary' }}>
              <Edit size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Vehicle">
            <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: 'error.main' }}>
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <AppPageTitle
        title="Transport Management"
        subtitle="School bus fleet management, driver allocations, and transit routes"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Transport' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
          >
            Add Vehicle
          </AppButton>
        }
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label={`Bus Fleet (${vehicles.length})`} />
          <Tab label={`Active Transit Routes (${routes.length})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Bus Fleet Table */}
      {activeTab === 0 && (
        <Card>
          <AppTable
            columns={vehicleColumns}
            data={vehicles}
            keyExtractor={(row) => row.id}
            emptyTitle="No vehicles found"
            emptyDescription="Add a school bus or van to begin tracking campus transit."
            emptyActionText="Add Vehicle"
            onEmptyAction={handleOpenAdd}
          />
        </Card>
      )}

      {/* Tab 1: Transit Routes Cards */}
      {activeTab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {routes.map((rt) => (
            <Card key={rt.id} sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {rt.routeName}
                  </Typography>
                  <Chip label={rt.vehicleNumber} size="small" color="primary" sx={{ fontWeight: 700 }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 2, fontSize: '0.85rem' }}>
                  <Navigation size={16} color="#2563eb" />
                  <span>{rt.startPoint} ➔ {rt.endPoint}</span>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, p: 2, borderRadius: 2, bgcolor: 'action.hover', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Pickup Time:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{rt.morningPickupTime}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Drop-off Time:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{rt.afternoonDropTime}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Total Stops:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{rt.stopsCount} Waypoints</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Monthly Fare:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>{formatCurrency(rt.monthlyFee)}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Users size={16} color="#64748b" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {rt.assignedStudentsCount} Enrolled Students
                  </Typography>
                </Box>
                <Chip label="Daily Transit" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Modals */}
      <VehicleModal
        open={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicle={selectedVehicle}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.vehicleNumber}
        title="Delete Vehicle"
      />
    </Box>
  );
};
