// Equipo 5
const request = require('supertest');
const { expect } = require('chai');

const api = request('https://citas-dsw5.firebaseio.com');

describe('API Appointments (Equipo 5) - consumo remoto', () => {
  let authToken;
  let appointmentId;
  let citaId;
  let doctorId;
  let patientId;

  beforeEach(async () => {
    await api.post('/auth/register').send({ username: 'doc1', password: 'pass' });
    const resLogin = await api.post('/auth/login').send({ username: 'doc1', password: 'pass' });
    expect(resLogin.status).to.equal(200);
    authToken = resLogin.body.token;

    const resDoc = await api.post('/doctors').set('Authorization', `Bearer ${authToken}`).send({ name: 'Dr. House' });
    expect(resDoc.status).to.equal(201);
    doctorId = resDoc.body.id;

    const resPat = await api.post('/patients').set('Authorization', `Bearer ${authToken}`).send({ name: 'Patient A' });
    expect(resPat.status).to.equal(201);
    patientId = resPat.body.id;

    const resApp = await api.post('/appointments').set('Authorization', `Bearer ${authToken}`).send({ doctorId, patientId, date: '2025-05-01' });
    expect(resApp.status).to.equal(201);
    appointmentId = resApp.body.id;

    const resCita = await api.post('/citas').set('Authorization', `Bearer ${authToken}`).send({ patientId, appointmentId });
    expect(resCita.status).to.equal(201);
    citaId = resCita.body.id;
  });

  describe('Appointments endpoints', () => {
    it('Debe obtener citas de hoy', async () => {
      const res = await api
        .get(`/appointments/${doctorId}/today`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('Debe obtener historial de citas', async () => {
      const res = await api
        .get(`/appointments/${doctorId}/history`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('Debe agregar una cita', async () => {
      const newApp = { doctorId, patientId, date: '2025-05-02' };
      const res = await api
        .post('/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newApp);
      expect(res.status).to.equal(201);
      expect(res.body).to.include(newApp);
      expect(res.body).to.have.property('id');
    });

    it('Debe delegar una cita', async () => {
      const res = await api
        .patch(`/appointments/${appointmentId}/delegate`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
    });
  });

  describe('Citas endpoints', () => {
    it('Debe eliminar una cita', async () => {
      const res = await api
        .delete(`/citas/${citaId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);

      const list = await api.get(`/patients/${patientId}/citas`).set('Authorization', `Bearer ${authToken}`);
      expect(list.body.find(c => c.id === citaId)).to.be.undefined;
    });

    it('Debe solicitar cambio de médico', async () => {
      const res = await api
        .patch(`/citas/${citaId}/cambiar-medico`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
    });

    it('Debe confirmar cita', async () => {
      const res = await api
        .patch(`/appointments/${doctorId}/${appointmentId}/confirm`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
    });
  });

  describe('Doctors endpoints', () => {
    it('Debe listar médicos', async () => {
      const res = await api
        .get('/doctors')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('Debe agregar un médico', async () => {
      const newDoc = { name: 'Dr. Who' };
      const res = await api
        .post('/doctors')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newDoc);
      expect(res.status).to.equal(201);
      expect(res.body).to.include(newDoc);
    });

    it('Debe dar vacaciones a un médico', async () => {
      const res = await api
        .patch(`/doctors/${doctorId}/vacation`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
    });
  });

  describe('Patients & Users endpoints', () => {
    it('Debe enviar recordatorio de cita', async () => {
      const res = await api
        .post(`/patients/${patientId}/appointments/${appointmentId}/reminder`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
    });

    it('Debe actualizar usuario', async () => {
      const res = await api
        .put(`/usuarios/${patientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated' });
      expect(res.status).to.equal(200);
    });
  });
});