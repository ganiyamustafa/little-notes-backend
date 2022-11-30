import joi from 'joi';

const PostUserPayloadSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().min(8).required(),
  email: joi.string().email().required()
});

export { PostUserPayloadSchema }
