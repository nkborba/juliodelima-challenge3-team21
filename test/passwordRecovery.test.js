const request = require('supertest');
const app = require('../src/app');
const should = require('should');

describe('Password Recovery API', function () {
  it('should send recovery instructions if user exists', async function () {
    const res = await request(app)
      .post('/api/recover')
      .send({ username: 'alice' });
    res.status.should.equal(200);
    res.body.message.should.match(/Password recovery instructions sent/);
  });

  it('should return 404 if user does not exist', async function () {
    const res = await request(app)
      .post('/api/recover')
      .send({ username: 'nonexistent' });
    res.status.should.equal(404);
    res.body.message.should.equal('User not found');
  });
});
