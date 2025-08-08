const { getUser, findUserByUsernameOrEmail, updateUser } = require('./users');

function recoverPassword(req, res) {
  const { email } = req.body;
  const user = findUserByUsernameOrEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  updateUser(user.username, { failedAttempts: 0, blocked: false });
  // Simulate sending recovery email
  return res.status(200).json({ message: `Password recovery instructions sent to ${user.email}` });
}

module.exports = { recoverPassword };
