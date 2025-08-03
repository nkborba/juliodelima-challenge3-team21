const users = [
  {
    username: 'alice',
    password: 'password123',
    email: 'alice@example.com',
    failedAttempts: 0,
    blocked: false,
  }
];

function getUser(username) {
  return users.find(u => u.username === username);
}

function findUserByUsernameOrEmail(identifier) {
  return users.find(user => user.username === identifier || user.email === identifier);
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

function addUser(user) {
  users.push(user);
}

function removeUser(username) {
  const idx = users.findIndex(u => u.username === username);
  if (idx !== -1) users.splice(idx, 1);
}

module.exports = { users, getUser, findUserByUsernameOrEmail, updateUser, resetFailedAttempts, addUser, removeUser };
