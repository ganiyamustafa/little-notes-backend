import UsersHandler from './handler';
import UsersService from '../../service/mongo/UsersService';
import UserValidator from '../../validators/user';
import { User } from '../../models/UserSchema';
import routes from './router';

const handler = new UsersHandler(new UsersService(User), UserValidator);

export default (app) => routes(app, handler)
