import request from 'supertest';
import server from '../index';

describe('Index file aka server configuration', () => {
  it('should return welcome message', async () => {
    const response = await request(server)
      .get('/api')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({ message: 'Welcome to backend!' });
  });

  it('should handle unknown routes', async () => {
    await request(server).get('/nonexistent').expect(404);
  });

  it('should mount signup router', async () => {
    const response = await request(server).post('/signup');
    expect(response.status).not.toBe(404);
  });

  it('should mount login router', async () => {
    const response = await request(server).post('/login');
    expect(response.status).not.toBe(404);
  });

  it('should mount property router', async () => {
    const response = await request(server).get('/property/getPropertiesByPage');
    expect(response.status).not.toBe(404);
  });

  it('should mount info router', async () => {
    const response = await request(server).get(
      '/info/getContactInfoForProperty',
    );
    expect(response.status).not.toBe(404);
  });

  it('should include CORS headers', async () => {
    const response = await request(server)
      .get('/api')
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173',
    );
  });

  it('should handle CORS preflight', async () => {
    const response = await request(server)
      .options('/api')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');

    expect(response.headers['access-control-allow-methods']).toContain('GET');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should parse JSON bodies', async () => {
    await request(server)
      .post('/signup')
      .send({ test: 'value' })
      .set('Content-Type', 'application/json')
      .expect((res) => {
        expect(res.status).not.toBe(415);
      });
  });
});
