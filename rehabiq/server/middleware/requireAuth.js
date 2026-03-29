/**
 * Requires an authenticated counselor session (set by POST /api/auth/login).
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated === true) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

module.exports = requireAuth;
