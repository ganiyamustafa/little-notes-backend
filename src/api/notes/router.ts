import auth from '../../middleware/auth';

export default (app, handler) => {
	app.route('/notes')
		.get(auth, handler.getNotesHandler)
		.post(auth, handler.postNoteHandler)

	app.route('/notes/:noteId')
		.get(auth, handler.getNoteByIdHandler)
		.put(auth, handler.putNoteByIdHandler)
		.delete(auth, handler.deleteNoteByIdHandler)
};
