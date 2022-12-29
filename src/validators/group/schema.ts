import joi from 'joi';

const PostGroupPayloadSchema = joi.object({
  name: joi.string().required(),
  notes: joi.array()
});

const PutGroupPayloadSchema = joi.object({
  name: joi.string(),
  notes: joi.array(),
  members: joi.array()
});

export { PostGroupPayloadSchema, PutGroupPayloadSchema };
