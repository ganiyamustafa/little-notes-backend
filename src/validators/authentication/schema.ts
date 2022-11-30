import joi from 'joi';

const PostAuthenticationPayloadSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

const PutAuthenticationPayloadSchema = joi.object({
  refreshToken: joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = joi.object({
  refreshToken: joi.string().required(),
});

export {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
