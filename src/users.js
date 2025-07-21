const users = [
  {
    username: 'alice',
    password: 'password123',
    email: 'alice@example.com',
    failedAttempts: 0,
    blocked: false,
  },
  {
    username: 'bob',
    password: 'securepass',
    email: 'bob@example.com',
    failedAttempts: 0,
    blocked: false,
  },
];

function getUser(username) {
  return users.find(u => u.username === username);
}

function updateUser(username, updates) {
  const user = getUser(username);
  if (user) {
    Object.assign(user, updates);
  }
}

function resetFailedAttempts(username) {
  updateUser(username, { failedAttempts: 0, blocked: false });
}

module.exports = { users, getUser, updateUser, resetFailedAttempts };
