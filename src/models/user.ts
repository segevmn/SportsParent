import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: false, default: '' },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'coach', 'scout'],
    default: 'user',
  },
  verified: {
    coach: { type: Boolean, default: false },
    scout: { type: Boolean, default: false },
  },
});

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model<User>('User', userSchema);
