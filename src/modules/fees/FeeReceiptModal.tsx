import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Printer, ShieldCheck } from 'lucide-react';
import { AppModal } from '../../components/common/AppModal';
import { AppButton } from '../../components/common/AppButton';
import { FeeVoucher } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export interface FeeReceiptModalProps {
  open: boolean;
  onClose: () => void;
  voucher: FeeVoucher | null;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  open,
  onClose,
  voucher,
}) => {
  const { settings } = useSchool();

  if (!voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = voucher.status === 'Paid';

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Official Fee Receipt Voucher"
      subtitle={`Voucher Number: ${voucher.invoiceNo}`}
      maxWidth="md"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Close
          </AppButton>
          <AppButton
            variant="contained"
            color="primary"
            icon={<Printer size={16} />}
            onClick={handlePrint}
          >
            Print Receipt
          </AppButton>
        </>
      }
    >
      <Paper
        id="printable-fee-receipt"
        sx={{
          p: 4,
          borderRadius: 2,
          border: '1px solid #cbd5e1',
          position: 'relative',
          backgroundColor: '#ffffff',
          color: '#0f172a',
        }}
      >
        {/* Paid / Unpaid Watermark Stamp */}
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            right: '12%',
            transform: 'rotate(-20deg)',
            border: `4px solid ${isPaid ? '#10b981' : '#f59e0b'}`,
            color: isPaid ? '#10b981' : '#f59e0b',
            borderRadius: 3,
            px: 3,
            py: 1,
            fontWeight: 900,
            fontSize: '2rem',
            letterSpacing: '0.15em',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        >
          {isPaid ? 'PAID & VERIFIED' : 'PENDING PAYMENT'}
        </Box>

        {/* School Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: '#2563eb',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={26} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {settings.schoolName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                {settings.address} • Phone: {settings.phone}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb' }}>
              FEE RECEIPT
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'block' }}>
              Invoice: {voucher.invoiceNo}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Issued Date: {formatDate(voucher.paidDate || voucher.dueDate)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

        {/* Student & Bill Details Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Billed To Student:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {voucher.studentName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Admission ID: <strong>{voucher.admissionNo}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Class: <strong>{voucher.className}</strong>
            </Typography>
          </Box>

          <Box sx={{ textAlign: { sm: 'right' } }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Billing Info:
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Academic Term: <strong>{voucher.academicTerm}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Due Date: <strong>{formatDate(voucher.dueDate)}</strong>
            </Typography>
            {isPaid && (
              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>
                Payment Method: {voucher.paymentMethod || 'Bank Wire'} ({voucher.transactionId || 'N/A'})
              </Typography>
            )}
          </Box>
        </Box>

        {/* Line Items Table */}
        <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, mb: 3 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Description / Item</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Gross Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Discount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Net Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{voucher.feeType}</TableCell>
                <TableCell align="right" sx={{ color: '#475569' }}>{formatCurrency(voucher.amount)}</TableCell>
                <TableCell align="right" sx={{ color: '#10b981', fontWeight: 600 }}>
                  -{formatCurrency(voucher.discount)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {formatCurrency(voucher.netAmount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Box sx={{ minWidth: 220 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Subtotal:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(voucher.amount)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Discount:</Typography>
              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>-{formatCurrency(voucher.discount)}</Typography>
            </Box>
            <Divider sx={{ my: 1, borderColor: '#cbd5e1' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>Total Paid:</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2563eb' }}>
                {formatCurrency(voucher.netAmount)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer Signatures */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: 3, borderTop: '1px dashed #cbd5e1' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
              This is a computer-generated student fee receipt.
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              EduManage Academic Suite • All rights reserved
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', minWidth: 160 }}>
            <Box sx={{ borderBottom: '1px solid #0f172a', mb: 0.5, pb: 2, fontStyle: 'italic', color: '#475569' }}>
              Dr. Sarah Jenkins
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Authorized Bursar Signature
            </Typography>
          </Box>
        </Box>
      </Paper>
    </AppModal>
  );
};
