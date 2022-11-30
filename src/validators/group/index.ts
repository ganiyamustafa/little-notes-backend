import ClientError from '../../exceptions/ClientError';
import { PostGroupPayloadSchema, PutGroupPayloadSchema } from './schema';

const GroupNoteValidator = {
  validatePostGroupPayload: (payload) => {
    const postGroupNoteValidationResult = PostGroupPayloadSchema.validate(payload);

    if (postGroupNoteValidationResult.error) {
      throw new ClientError(postGroupNoteValidationResult.error.message);
    }
  },
  validatePutGroupPayload: (payload) => {
    const putGroupNoteValidationResult = PutGroupPayloadSchema.validate(payload);

    if (putGroupNoteValidationResult.error) {
      throw new ClientError(putGroupNoteValidationResult.error.message);
    }
  }
};

export default GroupNoteValidator;
