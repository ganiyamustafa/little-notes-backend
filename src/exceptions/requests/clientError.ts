export default (error, res) => {
  return res.status(error.statusCode).send({
    status: 'error',
    message: error.message,
  });
}