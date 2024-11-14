const loginSuccess = (req, res) => {
    if (req.user) {
      res.status(200).json({
        message: 'Login successful',
        user: req.user,
      });
    } else {
      res.status(401).json({ error: 'User not authenticated' });
    }
  };
  
  const logoutUser = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.redirect('http://localhost:3001');
    });
  };
  
  module.exports = { loginSuccess, logoutUser };
  