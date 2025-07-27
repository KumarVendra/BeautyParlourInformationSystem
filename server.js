const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); 


const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.post('/api/appointments', async (req, res) => {
  try {
    const { customerName, email, phoneNumber, gender, service, date, time } = req.body;
    if (!customerName || !email || !phoneNumber || !gender || !service || !date || !time) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await Appointment.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const newAppointment = new Appointment({
      customerName,
      email: email.toLowerCase(),
      phoneNumber,
      gender,
      service,
      date,
      time
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const allAppointments = await Appointment.find().sort({ date: 1 });
    res.status(200).json(allAppointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

app.get('/api/appointments/:email', async (req, res) => {
  try {
    const user = await Appointment.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment" });
  }
});

app.delete('/api/appointments/:email', async (req, res) => {
  try {
    const deleted = await Appointment.findOneAndDelete({ email: req.params.email.toLowerCase() });
    if (!deleted) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting" });
  }
});

if (require.main === module) {
  mongoose.connect('mongodb://localhost:27017/beautyparlour')
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
      });
    })
    .catch(err => console.error("MongoDB connection error:", err));
}

// Export for testing
module.exports = { app, Appointment };
