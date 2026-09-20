import express from 'express';
import { db } from '../db/adapter';
import { sendAppointmentEmail, sendAppointmentWhatsApp } from '../services/notifications';

const router = express.Router();

// Public route to book an appointment
router.post('/book', async (req, res) => {
  try {
    const { name, phone, email, standard, message } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, error: 'Name, Phone, and Email are required fields.' });
    }

    // 1. Save to Database
    const newAppointment = await db.appointments.create({
      name,
      phone,
      email,
      standard,
      message,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    // 2. Trigger Notifications asynchronously (don't block the response)
    sendAppointmentEmail(newAppointment).catch(e => console.warn('Email notice skip:', e.message));
    sendAppointmentWhatsApp(newAppointment).catch(e => console.warn('WhatsApp notice skip:', e.message));

    res.status(201).json({ success: true, message: 'Appointment booked successfully', data: newAppointment });
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

import fs from 'fs';
import path from 'path';

const FORM_CONFIG_PATH = path.resolve(process.cwd(), 'server', 'data', 'form_configs.json');

// Helper to read form configs
const getSavedFormConfigs = () => {
  try {
    if (fs.existsSync(FORM_CONFIG_PATH)) {
      const data = fs.readFileSync(FORM_CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading form configs file:', err);
  }
  return null;
};

// Helper to write form configs
const saveFormConfigsToFile = (configs: any) => {
  try {
    const dir = path.dirname(FORM_CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FORM_CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving form configs file:', err);
    return false;
  }
};

// Route to get all form configurations
router.get('/configs', async (req, res) => {
  try {
    const configs = getSavedFormConfigs();
    res.json({ success: true, data: configs || {} });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to save/update form configurations
router.put('/configs', async (req, res) => {
  try {
    const configs = req.body;
    const ok = saveFormConfigsToFile(configs);
    if (!ok) {
      return res.status(500).json({ success: false, error: 'Failed to write form configurations' });
    }
    res.json({ success: true, message: 'Form configurations saved successfully', data: configs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin route to fetch all appointments / form inquiries
router.get('/', async (req, res) => {
  try {
    const appointments = await db.appointments.find().sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin route to update full appointment / enquiry details
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, standard, message, status, adminNotes } = req.body;
    const updateData: any = { updatedAt: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (standard !== undefined) updateData.standard = standard;
    if (message !== undefined) updateData.message = message;
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updated = await db.appointments.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Appointment not found' });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin route to update appointment status only
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await db.appointments.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date().toISOString() }, { new: true });
    if (!appointment) return res.status(404).json({ success: false, error: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin route to delete an appointment / inquiry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.appointments.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Appointment not found' });
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
