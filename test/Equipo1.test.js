// Equipo 1
const request = require('supertest');
const { expect } = require('chai');

const api = request('https://api-rest-biblioteca.onrender.com/apiV1/libros');

describe('API Biblioteca (sin modelos locales)', () => {
  describe('GET /api/autores', () => {
    it('debería devolver un array de autores', async () => {
      const res = await api.get('/api/autores');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /api/autores', () => {
    it('debería crear un autor y devolverlo con id', async () => {
      const nuevo = { nombre: 'Prueba Autor' };
      const res = await api.post('/api/autores').send(nuevo);
      expect(res.status).to.equal(201);
      expect(res.body).to.include({ nombre: 'Prueba Autor' });
      expect(res.body).to.have.property('id');
    });
  });

  // Libros
  describe('GET /api/libros', () => {
    it('debería devolver un array de libros', async () => {
      const res = await api.get('/api/libros');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /api/libros', () => {
    it('debería crear un libro y devolverlo con id', async () => {
      const nuevo = { titulo: 'Libro de Prueba', autorId: 1 };
      const res = await api.post('/api/libros').send(nuevo);
      expect(res.status).to.equal(201);
      expect(res.body).to.include({ titulo: 'Libro de Prueba', autorId: 1 });
      expect(res.body).to.have.property('id');
    });
  });

  describe('GET /api/libros/:id', () => {
    it('debería obtener un libro por su id', async () => {
      const create = await api.post('/api/libros').send({ titulo: 'Otro Libro', autorId: 1 });
      const id = create.body.id;
      const res = await api.get(`/api/libros/${id}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('titulo', 'Otro Libro');
    });
  });

  // Préstamos
  describe('GET /api/prestamos', () => {
    it('debería devolver un array de préstamos', async () => {
      const res = await api.get('/api/prestamos');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /api/prestamos', () => {
    it('debería crear un préstamo', async () => {
      const nuevo = { libroId: 1, usuario: 'Tester', fecha: '2025-05-01' };
      const res = await api.post('/api/prestamos').send(nuevo);
      expect(res.status).to.equal(201);
      expect(res.body).to.include({ libroId: 1, usuario: 'Tester', fecha: '2025-05-01' });
      expect(res.body).to.have.property('devuelto', false);
    });
  });

  // Usuarios
  describe('POST /api/usuarios', () => {
    it('debería crear un usuario', async () => {
      const nuevo = { nombre: 'UsuarioPrueba' };
      const res = await api.post('/api/usuarios').send(nuevo);
      expect(res.status).to.equal(201);
      expect(res.body).to.include({ nombre: 'UsuarioPrueba' });
      expect(res.body).to.have.property('id');
    });
  });
});
