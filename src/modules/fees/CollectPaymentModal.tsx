import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle2, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { FeeVoucher, PaymentMethod } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { formatCurrency } from '../../utils/formatters';

export interface CollectPaymentModalProps {
  open: boolean;
  onClose: () => void;
  voucher: FeeVoucher | null;
}

export const CollectPaymentModal: React.FC<CollectPaymentModalProps> = ({
  open,
  onClose,
  voucher,
}) => {
  const { payFeeVoucher } = useSchool();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [transactionId, setTransactionId] = useState(() => `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`);

  if (!voucher) return null;

  const handleConfirmPayment = () => {
    payFeeVoucher(voucher.id, paymentMethod, transactionId);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Record Fee Payment"
      subtitle={`Invoice: ${voucher.invoiceNo} • ${voucher.studentName}`}
      maxWidth="xs"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton
            variant="contained"
            color="success"
            icon={<CheckCircle2 size={16} />}
            onClick={handleConfirmPayment}
          >
            Confirm & Mark Paid
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: 'action.hover',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            AMOUNT TO COLLECT
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>
            {formatCurrency(voucher.netAmount)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {voucher.feeType} • {voucher.className}
          </Typography>
        </Box>

        <AppDropdown
          label="Payment Gateway / Mode"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          options={[
            { value: 'Bank Transfer', label: 'Bank Wire / ACH' },
            { value: 'Credit Card', label: 'Credit / Debit Card' },
            { value: 'Cash', label: 'Cash Payment (Bursar Counter)' },
            { value: 'Online Gateway', label: 'Online Parent Portal Gateway' },
            { value: 'Cheque', label: 'Bank Cheque' },
          ]}
        />

        <AppInput
          label="Transaction / Reference ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="e.g. TXN-12345678"
          helperText="Bank receipt or cash register reference number"
        />
      </Box>
    </AppModal>
  );
};
