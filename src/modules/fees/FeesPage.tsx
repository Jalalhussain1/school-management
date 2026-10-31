import React, { useState, useMemo } from 'react';
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
  CreditCard,
  Plus,
  Printer,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  Trash2,
  Edit,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppSearch } from '../../components/common/AppSearch';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { AppTable, Column } from '../../components/common/AppTable';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { FeeVoucherModal } from './FeeVoucherModal';
import { CollectPaymentModal } from './CollectPaymentModal';
import { FeeReceiptModal } from './FeeReceiptModal';
import { FeeVoucher } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const FeesPage: React.FC = () => {
  const { feeVouchers, feeCategories, deleteFeeVoucher, classes } = useSchool();

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<FeeVoucher | null>(null);

  const [collectVoucher, setCollectVoucher] = useState<FeeVoucher | null>(null);
  const [receiptVoucher, setReceiptVoucher] = useState<FeeVoucher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FeeVoucher | null>(null);

  // Computed summary metrics
  const summary = useMemo(() => {
    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let overdueCount = 0;

    feeVouchers.forEach((v) => {
      totalBilled += v.netAmount;
      if (v.status === 'Paid') {
        totalCollected += v.netAmount;
      } else {
        totalPending += v.netAmount;
        if (v.status === 'Overdue') overdueCount++;
      }
    });

    const rate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
    return { totalBilled, totalCollected, totalPending, overdueCount, rate };
  }, [feeVouchers]);

  // Filtering
  const filteredVouchers = useMemo(() => {
    return feeVouchers.filter((v) => {
      const matchSearch =
        searchQuery === '' ||
        v.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
      const matchClass = classFilter === 'ALL' || v.className === classFilter;

      return matchSearch && matchStatus && matchClass;
    });
  }, [feeVouchers, searchQuery, statusFilter, classFilter]);

  const paginatedVouchers = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredVouchers.slice(startIndex, startIndex + pageSize);
  }, [filteredVouchers, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedVoucher(null);
    setIsVoucherModalOpen(true);
  };

  const handleOpenEdit = (v: FeeVoucher) => {
    setSelectedVoucher(v);
    setIsVoucherModalOpen(true);
  };

  const handleOpenDelete = (v: FeeVoucher) => {
    setDeleteTarget(v);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteFeeVoucher(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns: Column<FeeVoucher>[] = [
    {
      id: 'invoiceNo',
      label: 'Invoice ID',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {row.invoiceNo}
        </Typography>
      ),
    },
    {
      id: 'student',
      label: 'Student',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.studentName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.className} • Adm: {row.admissionNo}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'feeType',
      label: 'Fee Description',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.feeType}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.academicTerm}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'netAmount',
      label: 'Net Payable',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {formatCurrency(row.netAmount)}
          </Typography>
          {row.discount > 0 && (
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
              Discount: -{formatCurrency(row.discount)}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(row.dueDate)}
        </Typography>
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          {row.status !== 'Paid' && (
            <AppButton
              size="small"
              variant="contained"
              color="success"
              icon={<DollarSign size={14} />}
              onClick={() => setCollectVoucher(row)}
              sx={{ fontSize: '0.75rem', px: 1.25, py: 0.5 }}
            >
              Collect
            </AppButton>
          )}

          <Tooltip title="Print Official Receipt">
            <IconButton size="small" onClick={() => setReceiptVoucher(row)} sx={{ color: 'primary.main' }}>
              <Printer size={17} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Voucher">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'text.secondary' }}>
              <Edit size={17} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Voucher">
            <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: 'error.main' }}>
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const classFilterOptions = [
    { value: 'ALL', label: 'All Classes' },
    ...classes.map((c) => ({ value: c.name, label: c.name })),
  ];

  return (
    <Box>
      <AppPageTitle
        title="Fee & Financial Management"
        subtitle="Voucher issuance, student payment reconciliation, fee structures, and receipt printing"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Fees' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
          >
            Issue Fee Voucher
          </AppButton>
        }
      />

      {/* KPI Stats Strip */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2.5,
          mb: 3.5,
        }}
      >
        <Card sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Fee Invoiced
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                {formatCurrency(summary.totalBilled)}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(37,99,235,0.1)', color: 'primary.main' }}>
              <FileText size={24} />
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Collected Revenue
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>
                {formatCurrency(summary.totalCollected)}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16,185,129,0.1)', color: 'success.main' }}>
              <CheckCircle size={24} />
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Outstanding Dues
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main', mt: 0.5 }}>
                {formatCurrency(summary.totalPending)}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245,158,11,0.1)', color: 'warning.main' }}>
              <AlertTriangle size={24} />
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Collection Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>
                {summary.rate}%
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(99,102,241,0.1)', color: 'secondary.main' }}>
              <CreditCard size={24} />
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Student Invoices & Vouchers" />
          <Tab label="Standard Fee Structure & Categories" />
        </Tabs>
      </Box>

      {/* Tab 0: Invoices Table */}
      {activeTab === 0 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' },
                  gap: 2,
                  justifyContent: 'space-between',
                }}
              >
                <AppSearch
                  value={searchQuery}
                  onChange={(val) => {
                    setSearchQuery(val);
                    setPage(1);
                  }}
                  placeholder="Search invoice number, student, or ID..."
                  width={{ xs: '100%', md: 340 }}
                />

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <AppDropdown
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as string);
                      setPage(1);
                    }}
                    options={[
                      { value: 'ALL', label: 'All Statuses' },
                      { value: 'Paid', label: 'Paid' },
                      { value: 'Unpaid', label: 'Unpaid' },
                      { value: 'Overdue', label: 'Overdue' },
                    ]}
                    sx={{ width: 140 }}
                  />

                  <AppDropdown
                    label="Class"
                    value={classFilter}
                    onChange={(e) => {
                      setClassFilter(e.target.value as string);
                      setPage(1);
                    }}
                    options={classFilterOptions}
                    sx={{ width: 140 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <AppTable
              columns={columns}
              data={paginatedVouchers}
              keyExtractor={(row) => row.id}
              emptyTitle="No fee vouchers found"
              emptyDescription="No invoices matching your search or filters."
              emptyActionText="Issue First Voucher"
              onEmptyAction={handleOpenAdd}
            />

            {filteredVouchers.length > 0 && (
              <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
                <Pagination
                  currentPage={page}
                  totalItems={filteredVouchers.length}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </Box>
            )}
          </Card>
        </>
      )}

      {/* Tab 1: Standard Fee Structure */}
      {activeTab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {feeCategories.map((cat) => (
            <Card key={cat.id} sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {cat.name}
                  </Typography>
                  <Chip label={cat.frequency} size="small" color="primary" sx={{ fontWeight: 700 }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {cat.description}
                </Typography>
              </Box>

              <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Standard Fee Rate:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {formatCurrency(cat.amount)}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Modals */}
      <FeeVoucherModal
        open={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        voucher={selectedVoucher}
      />

      <CollectPaymentModal
        open={Boolean(collectVoucher)}
        onClose={() => setCollectVoucher(null)}
        voucher={collectVoucher}
      />

      <FeeReceiptModal
        open={Boolean(receiptVoucher)}
        onClose={() => setReceiptVoucher(null)}
        voucher={receiptVoucher}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.invoiceNo}
        title="Delete Fee Invoice"
        message={`Are you sure you want to cancel and delete invoice "${deleteTarget?.invoiceNo}" for ${deleteTarget?.studentName}?`}
      />
    </Box>
  );
};
