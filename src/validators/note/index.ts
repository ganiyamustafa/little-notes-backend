import ClientError from '../../exceptions/ClientError';
import { PostNotePayloadSchema, PutNotePayloadSchema } from './schema';

const NoteValidator = {
  validatePostNotePayload: (payload) => {
    const noteValidationResult = PostNotePayloadSchema.validate(payload);

    if (noteValidationResult.error) {
      throw new ClientError(noteValidationResult.error.message);
    }
  },
  validatePutNotePayload: (payload) => {
    const noteValidationResult = PutNotePayloadSchema.validate(payload);

    if (noteValidationResult.error) {
      throw new ClientError(noteValidationResult.error.message);
    }
  },
};

export default NoteValidator;
