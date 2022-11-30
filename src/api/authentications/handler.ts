import ClientError from '../../exceptions/ClientError';
import { Request, Response } from 'express';

class AuthenticationsHandler {
  constructor(private _service, private _userService, private _validator, private _tokenManager) {
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req: Request, res: Response) {
    try {
      this._validator.validatePostAuthenticationPayload(req.body);

      const { username, password } = req.body;

      const userId = await this._userService.verifyUserCredential(username, password);
      const accessToken = this._tokenManager.generateAccessToken({ userId });
      const refreshToken = this._tokenManager.generateRefreshToken({ userId });

      await this._service.addRefreshToken(refreshToken)

      return res.status(200).send({
        status: 'success',
        message: "success create token",
        data: {
          accessToken,
          refreshToken
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
        message: "server error",
      });
    }
  }

  async putAuthenticationHandler(req: Request, res: Response) {
    try {
      this._validator.validatePutAuthenticationPayload(req.body);
      const { refreshToken } = req.body;
      await this._service.verifyRefreshToken(refreshToken);
      const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ userId });

      return res.status(200).send({
        status: 'success',
        message: 'Authentication successfully updated',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: "server error",
      });
    }   
  }

  async deleteAuthenticationHandler(req: Request, res: Response) {
    try {
      this._validator.validateDeleteAuthenticationPayload(req.body);
      const { refreshToken } = req.body;
      await this._service.deleteRefreshToken(refreshToken);
      return res.status(200).send({
        status: "success",
        message: "Successfully deleted authentication"
      })
    } catch(error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: error.message
      });
    }
  }
}

export default AuthenticationsHandler
