import auth from '../../middleware/auth';

export default (app, handler) => {
	app.route('/groups')
		.get(auth, handler.getGroupsHandler)
		.post(auth, handler.postGroupHandler)

	app.route('/groups/:groupId')
		.get(auth, handler.getGroupByIdHandler)
		.put(auth, handler.putGroupByIdHandler)
		.delete(auth, handler.deleteGroupByIdHandler)

	app.route('/groups/:groupId/notes')
		.get(auth, handler.getGroupNotesByIdHandler)
		.put(auth, handler.putGroupNotesByIdHandler)
		.delete(auth, handler.deleteGroupNotesByIdHandler)

	app.route('/groups/:groupId/members')
		.get(auth, handler.getGroupMembersByIdHandler)
		.delete(auth, handler.deleteGroupsMembersByIdHandler)
};
