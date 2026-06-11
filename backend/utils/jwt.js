const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpire,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpire,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtAccessSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
