import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { FeeVoucher } from '../types';

const feeVoucherCreateSchema = z.object({
  invoiceNo: z.string().optional(),
  studentId: z.string(),
  studentName: z.string(),
  admissionNo: z.string(),
  classId: z.string(),
  className: z.string(),
  feeType: z.string(),
  amount: z.number().positive(),
  discount: z.number().nonnegative(),
  netAmount: z.number().positive(),
  dueDate: z.string(),
  paidDate: z.string().optional(),
  status: z.enum(['Paid', 'Unpaid', 'Overdue', 'Partial']),
  paymentMethod: z.enum(['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'Online Gateway']).optional(),
  transactionId: z.string().optional(),
  academicTerm: z.string(),
});

const payVoucherSchema = z.object({
  paymentMethod: z.enum(['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'Online Gateway']),
  transactionId: z.string().optional(),
});

export const getFeeCategories = async (_req: Request, res: Response) => {
  const categories = db.getFeeCategories();
  return res.json({ success: true, data: categories });
};

export const getFeeVouchers = async (req: Request, res: Response) => {
  const { status, studentId, classId, search } = req.query as Record<string, string>;

  let vouchers = db.getFeeVouchers();

  if (status && status !== 'ALL') {
    vouchers = vouchers.filter((v) => v.status === status);
  }

  if (studentId) {
    vouchers = vouchers.filter((v) => v.studentId === studentId);
  }

  if (classId && classId !== 'ALL') {
    vouchers = vouchers.filter((v) => v.classId === classId || v.className === classId);
  }

  if (search) {
    const q = search.toLowerCase();
    vouchers = vouchers.filter(
      (v) =>
        v.studentName.toLowerCase().includes(q) ||
        v.invoiceNo.toLowerCase().includes(q) ||
        v.admissionNo.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    total: vouchers.length,
    data: vouchers,
  });
};

export const getFeeVoucherById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const voucher = db.getFeeVoucherById(id);

  if (!voucher) {
    return res.status(404).json({ success: false, message: 'Fee voucher not found' });
  }

  return res.json({ success: true, data: voucher });
};

export const createFeeVoucher = async (req: Request, res: Response) => {
  const data = feeVoucherCreateSchema.parse(req.body);

  const newVoucher: FeeVoucher = {
    ...data,
    id: `fvc-${Date.now()}`,
    invoiceNo: data.invoiceNo || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  db.addFeeVoucher(newVoucher);

  return res.status(201).json({
    success: true,
    message: `Invoice ${newVoucher.invoiceNo} generated successfully`,
    data: newVoucher,
  });
};

export const updateFeeVoucher = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateFeeVoucher(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Fee voucher not found' });
  }

  return res.json({
    success: true,
    message: 'Fee voucher updated successfully',
    data: updated,
  });
};

export const payFeeVoucher = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { paymentMethod, transactionId } = payVoucherSchema.parse(req.body);

  const updated = db.payFeeVoucher(id, paymentMethod, transactionId);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Fee voucher not found' });
  }

  return res.json({
    success: true,
    message: `Payment recorded via ${paymentMethod}`,
    data: updated,
  });
};

export const deleteFeeVoucher = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteFeeVoucher(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Fee voucher not found' });
  }

  return res.json({
    success: true,
    message: 'Fee voucher deleted successfully',
  });
};
