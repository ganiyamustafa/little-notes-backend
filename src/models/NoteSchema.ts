import mongoose, { Schema } from 'mongoose';

const noteSchema = new mongoose.Schema({
	title: {
		type: String,
		required: 'Please enter the title of notes'
	},
	description: {
		type: String
	},
	isPinned: {
		type: Boolean,
		default: false
	},
	isArchived: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	}
});

interface NoteInterface extends mongoose.Document {
	title: string,
	description: string,
	isPinned: boolean,
	user: string
}

const Note = mongoose.model<NoteInterface>('Notes', noteSchema);

export { NoteInterface, Note }

// interface NoteModelInterface extends mongoose.Model<any> {
// 	build(attr: NoteInterface): any
// }

// export const Note = mongoose.model<any, NoteModelInterface>('Notes', noteSchema);

// noteSchema.statics.build = (attr: NoteInterface) => {
// 	return new Note(attr)
// }
