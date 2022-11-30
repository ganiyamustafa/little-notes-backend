export default (app, handler) => {
  app.route('/authentications')
    .post(handler.postAuthenticationHandler)
    .put(handler.putAuthenticationHandler)
    .delete(handler.deleteAuthenticationHandler)
}