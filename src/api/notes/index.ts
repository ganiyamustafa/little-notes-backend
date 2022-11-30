import NotesHandler from './handler';
import NotesService from '../../service/mongo/NotesService';
import NoteValidator from '../../validators/note';
import { Note } from '../../models/NoteSchema';
import routes from './router';

const handler = new NotesHandler(new NotesService(Note), NoteValidator);

export default (app) => routes(app, handler)
