function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

// function socketAuth(socket, next) {
//   const token = socket.handshake.auth.token
//   const SECRET = process.env.JWT_SECRET

//   jwt.verify(token, SECRET)
// }

module.exports = {
  ensureAuthenticated,
  getUser,
};