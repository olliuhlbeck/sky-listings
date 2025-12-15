import request from 'supertest';
import express from 'express';
import unknownEndpoint from '../../../middlewares/unknownEndpoint/unknowEndpoint';

describe('unknownEndpoint middleware', () => {
  const app = express();

  app.use(unknownEndpoint);

  it('responds with 404 and appropriate message', async () => {
    const response = await request(app).get('/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Nothing came up with this search. Please check given URL.',
    });
  });
});
