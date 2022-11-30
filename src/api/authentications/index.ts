import AuthenticationsHandler from './handler';
import AuthenticationsService from '../../service/mongo/AuthenticationsService';
import AuthenticationValidator from '../../validators/authentication';
import UsersService from '../../service/mongo/UsersService';
import TokenManager from '../../tokenize/TokenManager';
import routes from './router';
import { Authentication } from '../../models/AuthenticationSchema';
import { User } from '../../models/UserSchema';

const handler = new AuthenticationsHandler(
    new AuthenticationsService(Authentication), 
    new UsersService(User), 
    AuthenticationValidator, 
    TokenManager
);

export default (app) => routes(app, handler)
