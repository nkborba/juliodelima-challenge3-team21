const { getUser } = require('./users');

function recoverPassword(req, res) {
  const { username } = req.body;
  const user = getUser(username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Simulate sending recovery email
  return res.status(200).json({ message: `Password recovery instructions sent to ${user.email}` });
}

module.exports = { recoverPassword };
