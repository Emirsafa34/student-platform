// backend/tests/app.test.js
const request = require('supertest');
const app     = require('../server');
const mongoose = require('mongoose');

describe('GET /', () => {
  it('responds 200 and correct text', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('🎯 API çalışıyor');
  });
});

afterAll(async () => {
  // MongoDB bağlantısını kapatın
  await mongoose.disconnect();
});
