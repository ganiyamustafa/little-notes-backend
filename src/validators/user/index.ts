import ClientError from "../../exceptions/ClientError";
import { PostUserPayloadSchema } from "./schema";

const UserValidator = {
  validateUserPayload: (payload) => {
    const userValidationResult = PostUserPayloadSchema.validate(payload);

    if (userValidationResult.error) {
      console.log(userValidationResult.error)
      throw new ClientError(userValidationResult.error.message);
    }
  }
};

export default UserValidator;
