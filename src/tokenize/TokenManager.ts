import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/InvariantError';

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

export default TokenManager;
