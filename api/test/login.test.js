const request = require('supertest');
const should = require('should');
const { resetFailedAttempts, updateUser, addUser, removeUser } = require('../src/users');

// NOTE: The server must be running on localhost:3000 before running these tests
const SERVER_URL = 'http://localhost:3000';

describe('Login endpoint', function () {
  beforeEach(() => {
    resetFailedAttempts('alice');
  });

  before(function () {
    defaultUser = {
      username: 'alice',
      rightPassword: 'password123',
      wrongPass: 'wrongpass',
      email: 'alice@example.com'
    }
  })

  it('should login successfully with correct credentials', async function () {
    const res = await request(SERVER_URL)
      .post('/api/login')
      .send({ username: defaultUser.username, password: defaultUser.rightPassword });
    res.status.should.equal(200);
    res.body.message.should.equal('Login successful');
  });

  it('should fail with invalid credentials', async function () {
    const res = await request(SERVER_URL)
      .post('/api/login')
      .send({ username: defaultUser.username, password: defaultUser.wrongPass });
    res.status.should.equal(401);
    res.body.message.should.equal('Invalid credentials. You have 2 attempts left');
  });

  it('should display a warning message for 1 attempt left', async function () {
    const testUser = {
      username: 'test1',
      password: 'securepass',
      email: 'bob@example.com',
      failedAttempts: 1,
      blocked: false,
    };
    addUser(testUser);
    const res = await request(SERVER_URL)
      .post('/api/login')
      .send({ username: testUser.username, password: 'wrongpass' });
    res.status.should.equal(401);
    res.body.message.should.equal('Invalid credentials. You have 1 attempts left');
    removeUser('testUser');
  });

  it('should block after 3 failed attempts', async function () {
    let res;
    for (let i = 0; i < 3; i++) {
      res = await request(SERVER_URL)
        .post('/api/login')
        .send({ username: defaultUser.username, password: defaultUser.wrongPass });
    }
    res.status.should.equal(401);
    res.body.message.should.equal('Account blocked after 3 failed attempts');
  });
});