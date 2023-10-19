import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Gender, IDType, Provider, Role } from 'src/common/constants';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken: string;
  photo: string;
  role: Role;
  isProfileComplete: boolean;
  providers: Provider[];
  phoneNumber: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  ipAddress: string;
  loginRetries: number;
  address: string[];
  gender: Gender;
  idType: IDType;
  isIdVerified: boolean;
  isSuspended: boolean;
  isEmailVerified: boolean;
  isDeleted: boolean;
  lastLogin: Date;
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
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email field is required'],
      unique: true,
    },
    password: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    photo: {
      type: String,
    },
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
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    loginRetries: {
      type: Number,
      default: 0,
    },
    address: {
      type: [String],
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    idType: {
      type: String,
      enum: Object.values(IDType),
    },
    isIdVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  if (!this.isProfileComplete) {
    const profiles = [
      this.firstName,
      this.lastName,
      this.email,
      this.phoneNumber,
      this.photo,
      this.address.length,
      this.gender,
      this.idType,
    ];
    this.isProfileComplete = profiles.every((profile) => Boolean(profile));
  }

  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Called when the userSchema is stringified using the JSON.stringify method
userSchema.method('toJSON', function (this: HydratedDocument<User>) {
  const user = this as any;
  const privateFields: Array<keyof User> = [
    'password',
    'refreshToken',
    'providers',
    'passwordResetExpires',
    'passwordResetToken',
    'isSuspended',
    'isDeleted',
  ];
  // Delete these field from the User object
  for (const privateField of privateFields) {
    delete user[privateField];
  }
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
