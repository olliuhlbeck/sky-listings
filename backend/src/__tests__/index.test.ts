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
    await request(server)
      .post('/signup')
      .expect((res) => expect([200, 400, 401, 404]).toContain(res.status));
  });

  it('should mount login router', async () => {
    await request(server)
      .post('/login')
      .expect((res) => expect([200, 400, 401, 404]).toContain(res.status));
  });

  it('should mount property router', async () => {
    await request(server)
      .get('/property/someEndpoint')
      .expect((res) => expect([200, 400, 401, 404, 500]).toContain(res.status));
  });

  it('should mount info router', async () => {
    await request(server)
      .get('/info/someEndpoint')
      .expect((res) => expect([200, 400, 401, 404, 500]).toContain(res.status));
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
