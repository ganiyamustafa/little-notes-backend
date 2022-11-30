import ClientError from '../../exceptions/ClientError';
import InvariantError from '../../exceptions/InvariantError';
import AuthenticationError from '../../exceptions/AuthenticationError';
import NotFoundError from '../../exceptions/NotFoundError';
import { compare } from 'bcrypt';
import { hash } from 'bcrypt';
import { UserInterface, User } from '../../models/UserSchema';

export default class UsersService {
  constructor(private _user: typeof User) {}

  async create({ username, password, email }): Promise<UserInterface> {
    try {
      const hashedPassword = await hash(password, 10);
      return await new this._user({ username, email, hashedPassword }).save();
    } catch (error) {
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          throw new ClientError(error.errors[key].message);
        });
      }
      throw new Error(error);
    }
  }

  async checkUsernameOrEmailIfExist(username, email) {
    const user = await this._user.findOne({ $or: [{ username: username}, { email: email }] }).exec();
    
    if (user) {
      if (user.username === username) { 
        throw new InvariantError("username is used");
      } else if (user.email === email) {
        throw new InvariantError("email is used");
      }
    }
  }
  
  async verifyUserCredential(username, password): Promise<string> {
    const user = await this._user.findOne({ username });

    if (!user) {
      throw new AuthenticationError('Invalid Credential');
    }

    if (!(await compare(password, user.hashedPassword))) {
      throw new AuthenticationError('Invalid Credential');
    }

    return user.id;
  }

  async findUserByEmail(email): Promise<UserInterface> {
    const user = await this._user.findOne({ email: email }).exec();

    if (!user) {
      throw new NotFoundError(`user not found`);
    }

    return user;
  }
}