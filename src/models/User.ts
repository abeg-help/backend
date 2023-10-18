import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Provider, Role } from 'src/common/constants';

export interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  refreshTokens: string[];
  photo?: string;
  role: Role;
  isProfileComplete: boolean;
  providers: Provider[];
  phoneNo?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  generateAuthToken(): string;
  generateRefreshToken(): string;
  toJSON(): object;
  verifyPassword: (enteredPassword: string) => Promise<boolean>;
}

type UserModel = Model<User, unknown, UserMethods>;

const userSchema = new mongoose.Schema<User, unknown, UserMethods>(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
    },
    password: String,
    refreshTokens: [String],
    phoneNo: String,
    photo: String,
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    providers: {
      type: [String],
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Called when the userSchema is stringified using the JSON.stringify method
userSchema.method('toJSON', function (this: HydratedDocument<User>) {
  const user = this as any;
  delete user.password;
  delete user.refreshTokens;
  return user;
});

// Verify user password

userSchema.method('verifyPassword', async function (this: HydratedDocument<User>, enteredPassword: string) {
  if (!this.password) {
    return false;
  }
  const isValid = await bcrypt.compare(enteredPassword, this.password);
  return isValid;
});

userSchema.method('generateAuthToken', function (this: HydratedDocument<User>) {
  // Implement functionality to generate auth token for user
});

userSchema.method('generateRefreshToken', function (this: HydratedDocument<User>) {
  // Implement functionality to generate refresh token for user
});

export default mongoose.model<User, UserModel>('User', userSchema);
