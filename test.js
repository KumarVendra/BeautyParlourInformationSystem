const request = require('supertest');
const mongoose = require('mongoose');
const { app, Appointment } = require('./server'); 
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/beautyparlour-test');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Beauty Parlour Appointment - CRUD Tests', () => {
  let testEmail = 'testclient@example.com';
  let testId;

  //Test Case 1. Create - Valid Appointment
  test('POST /api/appointments - should create appointment', async () => {
    const res = await request(app).post('/api/appointments').send({
      customerName: 'Test Client',
      email: testEmail,
      phoneNumber: '9876543210',
      gender: 'Female',
      service: 'Facial',
      date: '2025-07-25',
      time: '11:00 AM'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Appointment booked successfully!');
  });

  //Test Case 2. Create - Duplicate Email
  test('POST /api/appointments - duplicate email should fail', async () => {
    const res = await request(app).post('/api/appointments').send({
      customerName: 'Another Client',
      email: testEmail,
      phoneNumber: '9999999999',
      gender: 'Male',
      service: 'Haircut',
      date: '2025-07-26',
      time: '12:00 PM'
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Email already registered.');
  });

  //Test Case 3. Create - Missing Fields
  test('POST /api/appointments - missing fields returns 400', async () => {
    const res = await request(app).post('/api/appointments').send({
      email: 'incomplete@example.com'
    });
    expect(res.statusCode).toBe(400);
  });

  //Test Case 4. Read - Get All Appointments
  test('GET /api/appointments - should return all appointments', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    testId = res.body.find(a => a.email === testEmail)?._id;
  });

  //Test Case 5. Read - Get Appointment by Email
  test('GET /api/appointments/:email - should return appointment', async () => {
    const res = await request(app).get(`/api/appointments/${testEmail}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  //Test Case 6. Read - Invalid Email
  test('GET /api/appointments/unknown@example.com - should return 404', async () => {
    const res = await request(app).get('/api/appointments/unknown@example.com');
    expect(res.statusCode).toBe(404);
  });

  //Test Case 7. Update - Valid Appointment
  test('PUT /api/appointments/:id - should update appointment', async () => {
    const res = await request(app).put(`/api/appointments/${testId}`).send({
      service: 'Manicure',
      time: '2:00 PM'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.service).toBe('Manicure');
  });

  //Test Case 8. Update - Invalid ID
  test('PUT /api/appointments/invalidid - should return error', async () => {
    const res = await request(app).put('/api/appointments/invalidid').send({
      service: 'Haircut'
    });
    expect(res.statusCode).toBe(500);
  });

  //Test Case 9. Delete - Valid Appointment
  test('DELETE /api/appointments/:email - should delete appointment', async () => {
    const res = await request(app).delete(`/api/appointments/${testEmail}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Appointment deleted successfully');
  });

  //Test Case 10. Delete - Already Deleted
  test('DELETE /api/appointments/:email - deleting again returns 404', async () => {
    const res = await request(app).delete(`/api/appointments/${testEmail}`);
    expect(res.statusCode).toBe(404);
  });
});
