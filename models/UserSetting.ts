import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSetting extends Document {
  userId: string; // Assuming a user system, or a default ID for a single user app
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const UserSettingSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true, default: 'default_user' },
  totalBalance: { type: Number, required: true, default: 0 },
  monthlyIncome: { type: Number, required: true, default: 0 },
  monthlyExpenses: { type: Number, required: true, default: 0 },
});

const UserSetting = mongoose.models.UserSetting || mongoose.model<IUserSetting>('UserSetting', UserSettingSchema);

export default UserSetting;
