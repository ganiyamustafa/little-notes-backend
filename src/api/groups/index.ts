import GroupsHandler from './handler';
import GroupsService from '../../service/mongo/GroupsServices';
import NotesService from '../../service/mongo/NotesService';
import GroupValidator from '../../validators/group';
import { Group } from '../../models/GroupSchema';
import { Note } from '../../models/NoteSchema';
import routes from './router';

const handler = new GroupsHandler(new GroupsService(Group), new NotesService(Note), GroupValidator);

export default (app) => routes(app, handler)
