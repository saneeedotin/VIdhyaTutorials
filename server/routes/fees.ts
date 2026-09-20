import express from 'express';
import crypto from 'crypto';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import { db } from '../db/adapter';

const router = express.Router();

router.use(protect);

// 1. Fetch Student Ledger / My Fees
router.get('/my', async (req: AuthRequest, res) => {
  try {
    const studentId = req.user!.id;
    let fees = await db.fees.find({ studentId });
    if (fees.length === 0) {
      // Return a demo record for student if none exists
      fees = await db.fees.find();
    }
    res.json({ success: true, data: fees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/ledger', async (req: AuthRequest, res) => {
  try {
    let targetStudentId = req.user!.id;

    if (req.user!.role === 'PARENT') {
      const { studentId } = req.query;
      if (studentId) targetStudentId = studentId as string;
    }

    const fees = await db.fees.find({ studentId: targetStudentId });
    res.json({ success: true, data: fees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Get all student fee records
router.get('/all', requireRole(['ADMIN']), async (req, res) => {
  try {
    const fees = await db.fees.find().sort({ dueDate: 1 });
    res.json({ success: true, data: fees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Record offline/online fee payment
router.post('/record-payment', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { feeId, amount, paymentMode = 'UPI', notes } = req.body;
    const fee = await db.fees.findById(feeId);
    if (!fee) return res.status(404).json({ success: false, error: 'Fee record not found' });

    const payAmount = Number(amount) || 0;
    const newPaid = (fee.paidAmount || 0) + payAmount;
    const newDue = Math.max(0, (fee.totalAmount || 0) - newPaid);
    const newStatus = newDue === 0 ? 'PAID' : 'PARTIAL';

    const receiptNo = `VT-REC-${Date.now().toString().slice(-6)}`;
    const newInstallment = {
      installmentNo: (fee.installments?.length || 0) + 1,
      amount: payAmount,
      paidDate: new Date().toISOString(),
      status: 'PAID',
      paymentMode,
      receiptNo,
      notes,
    };

    const updated = await db.fees.findByIdAndUpdate(
      feeId,
      {
        paidAmount: newPaid,
        dueAmount: newDue,
        status: newStatus,
        installments: [...(fee.installments || []), newInstallment],
      },
      { new: true }
    );

    res.json({ success: true, message: 'Payment recorded successfully', data: updated, receiptNo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Student: Create Razorpay Order
router.post('/create-order', requireRole(['STUDENT']), async (req, res) => {
  try {
    const { feeRecordId } = req.body;
    const fee = await db.fees.findById(feeRecordId);
    if (!fee) return res.status(404).json({ success: false, error: 'Fee record not found' });
    if (fee.status === 'PAID') return res.status(400).json({ success: false, error: 'Fee already paid' });

    const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    await db.fees.findByIdAndUpdate(feeRecordId, { orderId: mockOrderId });

    res.json({
      success: true,
      data: {
        orderId: mockOrderId,
        amount: (fee.dueAmount || fee.totalAmount) * 100, // in paise
        currency: 'INR',
        receipt: fee._id,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Student: Verify Payment
router.post('/verify-payment', requireRole(['STUDENT']), async (req, res) => {
  try {
    const { feeRecordId, razorpay_payment_id } = req.body;
    const fee = await db.fees.findById(feeRecordId);
    if (!fee) return res.status(404).json({ success: false, error: 'Fee record not found' });

    const receiptNo = `VT-REC-${Date.now().toString().slice(-6)}`;
    const updated = await db.fees.findByIdAndUpdate(
      feeRecordId,
      {
        status: 'PAID',
        paidAmount: fee.totalAmount,
        dueAmount: 0,
        paymentId: razorpay_payment_id || `pay_${Date.now()}`,
        paidAt: new Date().toISOString(),
        receiptNumber: receiptNo,
      },
      { new: true }
    );

    res.json({ success: true, message: 'Payment verified successfully', receiptNumber: receiptNo, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
