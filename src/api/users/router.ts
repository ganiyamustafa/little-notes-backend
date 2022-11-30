export default (app, handler) => {
  app.route('/users')
    .post(handler.postUserHandler)
    .get(handler.getUserByEmail)
}