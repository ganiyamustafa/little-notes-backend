import ClientError from '../../exceptions/ClientError';
import userSerializer from '../../serializer/users';
import { Request, Response } from 'express';

class UsersHandler {
  constructor(private _service, private _validator) {
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.query;
      const user = await this._service.findUserByEmail(email);

      return res.status(200).send({
        status: 'success',
        message: 'success',
        data: userSerializer(user)
      });
    } catch(error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: 'server error',
      });
    }
  }

  async postUserHandler(req: Request, res: Response) {
    try {
      this._validator.validateUserPayload(req.body);

      const { username, email } = req.body;

      await this._service.checkUsernameOrEmailIfExist(username, email);
      const user = await this._service.create(req.body);

      return res.status(201).send({
        status: 'success',
        message: 'success create user',
        data: {
          userId: user.id
        }
      });
    } catch(error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: 'server error',
      });
    }
    
  }
}

export default UsersHandler
