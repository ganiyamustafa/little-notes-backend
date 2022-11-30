import mongoose from 'mongoose';

const authenticationSchema = new mongoose.Schema({
	token: {
		type: String,
		required: "Token can't be blank"
	}
});

interface AuthenticationInterface extends mongoose.Document {
	token: string
}

const Authentication = mongoose.model<AuthenticationInterface>('Authentications', authenticationSchema);

export { AuthenticationInterface, Authentication }
