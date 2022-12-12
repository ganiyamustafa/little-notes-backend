import joi from 'joi';

const PostNotePayloadSchema = joi.object({
  title: joi.string().required(),
  description: joi.string(),
});

const PutNotePayloadSchema = joi.object({
  title: joi.string(),
  description: joi.string(),
  isPinned: joi.boolean(),
  isArchived: joi.boolean()
})

export { PostNotePayloadSchema, PutNotePayloadSchema }
