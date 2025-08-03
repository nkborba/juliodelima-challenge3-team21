const request = require('supertest');
const app = require('../src/app');
const should = require('should');

const SERVER_URL = 'http://localhost:3000';

describe('Password Recovery API', function () {

  before(function () {
    defaultUser = {
      username: 'alice',
      email: 'alice@example.com'
    }
  })

  it('should send recovery instructions if user exists', async function () {

    const res = await request(SERVER_URL)
      .post('/api/recover')
      .send({ username: defaultUser.username });
    res.status.should.equal(200);
    res.body.message.should.equal(`Password recovery instructions sent to ${defaultUser.email}`);
  });

  it('should return 404 if user does not exist', async function () {
    const res = await request(SERVER_URL)
      .post('/api/recover')
      .send({ username: 'nonexistent' });
    res.status.should.equal(404);
    res.body.message.should.equal('User not found');
  });
});
