const request = require('supertest');
const app = require('../src/app');
const { resetFailedAttempts } = require('../src/users');

describe('Login API', function () {
  beforeEach(() => {
    resetFailedAttempts('alice');
  });

  it('should login successfully with correct credentials', async function () {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'alice', password: 'password123' });
    res.status.should.equal(200);
    res.body.message.should.equal('Login successful');
  });

  it('should fail with invalid credentials', async function () {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'alice', password: 'wrongpass' });
    res.status.should.equal(401);
    res.body.message.should.equal('Invalid credentials. You have 2 attempts left');
  });


  it('should correct warning for 1 attempts left', async function () {
    const user = {
      username: 'test2',
      password: 'password123',
    }
    const res = await request(app)
      .post('/api/login')
      .send({ username: user.username, password: user.password });
    res.status.should.equal(401);
    res.body.message.should.equal('Invalid credentials. You have 1 attempts left');
  });

  it('should correct warning for 2 attempts left', async function () {
    const user = {
      username: 'test1',
      password: 'password123',
    }
    const res = await request(app)
      .post('/api/login')
      .send({ username: user.username, password: user.password });
    res.status.should.equal(401);
    res.body.message.should.equal('Invalid credentials. You have 2 attempts left');
  });

  it('should block after 3 failed attempts', async function () {
    const user = {
      username: 'alice',
      password: 'wrongpass'
    }
    for (let i = 0; i < 2; i++) {
      await request(app)
        .post('/api/login')
        .send({ username: user.username, password:  user.password });
    }
    const res = await request(app)
      .post('/api/login')
      .send({ username: user.username, password: user.password });
    res.status.should.equal(401);
    res.body.message.should.equal('Account blocked after 3 failed attempts');
  });
});
