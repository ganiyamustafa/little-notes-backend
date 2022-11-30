export default (res) => {
    return res.status(500).send({
      status: 'error',
      message: 'Server Error',
    });
  }