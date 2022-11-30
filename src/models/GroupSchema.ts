import mongoose, { Schema } from 'mongoose';

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "name can't be blank"
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
		required: "owner can't be blank"
	},
	members: [{
		type: Schema.Types.ObjectId,
		ref: "Users"	
	}],
	notes: [{
		type: Schema.Types.ObjectId,
		ref: 'Notes'
	}],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	}
});

interface GroupInterface extends mongoose.Document {
	name: string,
	owner: string[],
	members: string[],
	notes: string[]
}

const Group = mongoose.model<GroupInterface>('groups', groupSchema);

export { GroupInterface, Group }
