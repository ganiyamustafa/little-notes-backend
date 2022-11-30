import InvariantError from '../../exceptions/InvariantError';
import { Authentication, AuthenticationInterface } from '../../models/AuthenticationSchema';

class AuthenticationsService {
  constructor(private _authentications: typeof Authentication) { }

  async addRefreshToken(token): Promise<AuthenticationInterface> {
    return await new this._authentications({ token }).save();
  }

  async verifyRefreshToken(token): Promise<AuthenticationInterface> {
    const result = await this._authentications.findOne({ token: token });
    if (!result) {
      throw new InvariantError('Invalid refresh token');
    }
    return result;
  }

  async deleteRefreshToken(token): Promise<AuthenticationInterface> {
    const result = await this.verifyRefreshToken(token);
    return result.delete();
  }
}

export default AuthenticationsService;
