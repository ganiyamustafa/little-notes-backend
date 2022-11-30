import ClientError from '../../exceptions/ClientError';
import { 
    PostAuthenticationPayloadSchema, 
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema
} from './schema';

const AuthenticationValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const authenticatoinValidationResult = PostAuthenticationPayloadSchema.validate(payload);

    if (authenticatoinValidationResult.error) {
      throw new ClientError(authenticatoinValidationResult.error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const authenticatoinValidationResult = PutAuthenticationPayloadSchema.validate(payload);

    if (authenticatoinValidationResult.error) {
      throw new ClientError(authenticatoinValidationResult.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const authenticatoinValidationResult = DeleteAuthenticationPayloadSchema.validate(payload);

    if (authenticatoinValidationResult.error) {
      throw new ClientError(authenticatoinValidationResult.error.message);
    }
  }
};

export default AuthenticationValidator;
