import auth from '../../middleware/auth';

export default (app, handler) => {
  app.route('/users')
    .post(handler.postUserHandler)
    .get(handler.getUserByEmail)

  app.route('/users/my')
    .get(auth, handler.getUserByToken)
}