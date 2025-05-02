// Equipo 4
const request = require('supertest');
const { expect } = require('chai');

const api = request(process.env.API_URL || 'https://api-debates-4.onrender.com/');

describe('API Debates (Equipo 4) - consumo remoto', () => {
  let authToken;
  let debateId;

  beforeEach(async () => {
    await api.post('/auth/register').send({ username: 'testuser', password: 'pass' });
    const resLogin = await api.post('/auth/login').send({ username: 'testuser', password: 'pass' });
    expect(resLogin.status).to.equal(200);
    authToken = resLogin.body.token;

    const resDebate = await api
      .post('/api/v1/debate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Debate 1', isPublic: true });
    expect(resDebate.status).to.equal(201);
    debateId = resDebate.body.id;
  });

  describe('Auth: register & login', () => {
    it('Debe registrar un usuario', async () => {
      const res = await api.post('/auth/register').send({ username: 'newUser', password: '1234' });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
    });

    it('Debe loguear y recibir token', async () => {
      const res = await api.post('/auth/login').send({ username: 'testuser', password: 'pass' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });
  });

  describe('Debates endpoints', () => {
    it('Debe obtener todos los debates privados/publicos con auth', async () => {
      const res = await api
        .get('/api/v1/debates')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').and.satisfy(arr => arr.length >= 1);
    });

    it('Debe obtener debates públicos sin auth', async () => {
      const res = await api.get('/api/v1/debates/public');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      if (res.body.length) {
        expect(res.body[0]).to.have.property('isPublic', true);
      }
    });

    it('Debe crear un debate nuevo', async () => {
      const nuevo = { title: 'Debate 2', isPublic: false };
      const res = await api
        .post('/api/v1/debate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(nuevo);
      expect(res.status).to.equal(201);
      expect(res.body).to.include(nuevo);
      expect(res.body).to.have.property('id');
    });
  });

  describe('Posición y comentarios', () => {
    it('Debe establecer posición en debate', async () => {
      const pos = { stance: 'pro' };
      const res = await api
        .post(`/api/v1/debate/${debateId}/position`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(pos);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('stance', 'pro');
    });

    it('Debe agregar un comentario al debate', async () => {
      const com = { text: 'Buen punto' };
      const res = await api
        .post(`/api/v1/debate/${debateId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(com);
      expect(res.status).to.equal(201);
      expect(res.body).to.include(com);
    });

    it('Debe actualizar un comentario existente', async () => {
      const createCom = await api
        .post(`/api/v1/debate/${debateId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Old' });
      const commentId = createCom.body.id;

      const res = await api
        .put(`/api/v1/comment/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Updated' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('text', 'Updated');
    });

    it('Debe eliminar un comentario', async () => {
      const createCom = await api
        .post(`/api/v1/debate/${debateId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'ToDelete' });
      const commentId = createCom.body.id;

      const res = await api
        .delete(`/api/v1/comment/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).to.equal(200);

      const all = await api.get(`/api/v1/debate/${debateId}/comments`);
      const exists = all.body.find(c => c.id === commentId);
      expect(exists).to.be.undefined;
    });
  });
});
