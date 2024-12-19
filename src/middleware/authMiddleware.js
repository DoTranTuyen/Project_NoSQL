const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if(!token) return res.status(401).send("Please login first");
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

function requireAdmin(req, res, next) {
  if(!req.user || req.user.role !== 'admin') return res.status(403).send("Forbidden");
  next();
}

module.exports = { requireAuth, requireAdmin };
