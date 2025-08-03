const { findUserByUsernameOrEmail, updateUser, resetFailedAttempts } = require('./users');

function login(req, res) {
  const { username, password } = req.body;
  const user = findUserByUsernameOrEmail(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (user.blocked) {
    return res.status(401).json({ message: 'Account blocked after 3 failed attempts' });
  }
  if (user.password !== password) {
    updateUser(username, { failedAttempts: user.failedAttempts + 1 });
    if (user.failedAttempts >= 3) {
      updateUser(username, { blocked: true });
      return res.status(401).json({ message: 'Account blocked after 3 failed attempts' });
    }
    return res.status(401).json({ message: `Invalid credentials. You have ${3-user.failedAttempts} attempts left`,
    failedAttempts: user.failedAttempts });
  }
  resetFailedAttempts(username);
  return res.status(200).json({ message: 'Login successful' });
}

module.exports = { login };
