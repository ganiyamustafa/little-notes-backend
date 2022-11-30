import mongoose from 'mongoose';
import {encrypt, decrypt } from '../middleware/crypter';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: "username can't be blank",
	},
	email: {
		type: String,
		required: "email can't be blank",
		get: decrypt,
		set: encrypt
	},
	hashedPassword: {
		type:String,
    required: "password can't be blank"
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	}
}, 
{
  versionKey: false,
  toObject: { getters: true },
  toJSON: { getters: true },
});

interface UserInterface extends mongoose.Document {
	username: string,
	email: string,
	hashedPassword: string
}

const User = mongoose.model<UserInterface>('Users', userSchema);

export { UserInterface, User }
