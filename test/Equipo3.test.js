// Equipo 3
const request = require('supertest');
const { expect } = require('chai');

const api = request('https://api-hotel-xpds.onrender.com/');

describe('API Hoteles (sin modelos locales)', () => {
  describe('GET /hotels', () => {
    it('debe devolver un array de hoteles', async () => {
      const res = await api.get('/hotels');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').and.have.length.at.least(1);
    });
  });

  describe('GET /search', () => {
    it('debe filtrar hoteles por location', async () => {
      const res = await api.get('/search').query({ location: 'Ciudad A' });
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      if (res.body.length) {
        expect(res.body[0]).to.have.property('location', 'Ciudad A');
      }
    });
  });

  describe('GET /hotels/:id', () => {
    it('debe obtener un hotel por id', async () => {
      const res = await api.get('/hotels/1');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name');
    });
  });

  describe('POST /hotels', () => {
    it('debe crear un hotel', async () => {
      const nuevo = { name: 'Posada Sol', location: 'Montaña C' };
      const res = await api.post('/hotels').send(nuevo);
      expect(res.status).to.equal(201);
      expect(res.body).to.include(nuevo);
      expect(res.body).to.have.property('id');
    });
  });

  describe('PUT /hotels/:id', () => {
    it('debe actualizar un hotel', async () => {
      const res = await api.put('/hotels/1').send({ name: 'Hotel Plaza Renovado' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Hotel Plaza Renovado');
    });
  });

  describe('DELETE /hotels/:id', () => {
    it('debe eliminar un hotel', async () => {
      const res = await api.delete('/hotels/1');
      expect(res.status).to.equal(200);
      const all = await api.get('/hotels');
      expect(all.body).to.be.an('array');
    });
  });

  describe('GET /hotels/:hotelId/rooms', () => {
    it('debe listar habitaciones de un hotel', async () => {
      const res = await api.get('/hotels/1/rooms');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /hotels/:hotelId/rooms/:id', () => {
    it('debe obtener detalles de una habitación', async () => {
      const res = await api.get('/hotels/1/rooms/1');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('type');
    });
  });

  describe('POST /hotels/:hotelId/rooms', () => {
    it('debe agregar una habitación', async () => {
      const nueva = { number: '103', type: 'suite' };
      const res = await api.post('/hotels/1/rooms').send(nueva);
      expect(res.status).to.equal(201);
      expect(res.body).to.include(nueva);
    });
  });

  describe('PUT /hotels/:hotelId/rooms/:id', () => {
    it('debe actualizar una habitación', async () => {
      const res = await api.put('/hotels/1/rooms/1').send({ type: 'deluxe' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('type', 'deluxe');
    });
  });

  describe('DELETE /hotels/:hotelId/rooms/:id', () => {
    it('debe eliminar una habitación', async () => {
      const res = await api.delete('/hotels/1/rooms/1');
      expect(res.status).to.equal(200);
      const all = await api.get('/hotels/1/rooms');
      expect(all.body).to.be.an('array');
    });
  });

  describe('GET /hotels/:hotelId/reviews', () => {
    it('debe listar reseñas de un hotel', async () => {
      const res = await api.get('/hotels/1/reviews');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /hotels/:hotelId/reviews', () => {
    it('debe crear una reseña', async () => {
      const nueva = { user: 'Luis', rating: 4, comment: 'Muy bien' };
      const res = await api.post('/hotels/1/reviews').send(nueva);
      expect(res.status).to.equal(201);
      expect(res.body).to.include(nueva);
    });
  });
});
