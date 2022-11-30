import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.status(403).send({
      status: 'error',
      messsage: 'A token is required for authentication'
    });
  }
  
  try {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.auth = jwt.verify(bearerToken, process.env.ACCESS_TOKEN_KEY);
  } catch (err) {
    return res.status(401).send({
      status: 'error',
      message: 'Invalid Token'
    });
  }
  return next();
};

export default verifyToken;