import mongoose, { Model, Schema } from 'mongoose';
import { IUserDocument } from '../common/interfaces/user';

const UserSchema: Schema<IUserDocument> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true
  }
});

const UserModel: Model<IUserDocument> = mongoose.model('User', UserSchema);

export default UserModel;
