function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function createPrivateRoom(a, b) {
  let array = [a, b]
  array.sort(a, b => (a-b))
  return array
}

function getMessagedUser(a, b) {
  let array = a.split('-')
  array.splice(array.indexOf(String(b)), 1)
  return (Number(array))
}

module.exports = {
  ensureAuthenticated,
  getUser,
  createPrivateRoom,
  getMessagedUser
};