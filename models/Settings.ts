// models/Settings.ts

import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
  key: {
    type: String,
    default: 'discordRoles',
    unique: true,
  },
  rootRoleId: {
    type: String,
    required: [true, 'ID roli roota jest wymagane.'],
    trim: true,
  },
  adminRoleId: {
    type: String,
    required: [true, 'ID roli admina jest wymagane.'],
    trim: true,
  },
  adderRoleId: {
    type: String,
    required: [true, 'ID roli addera jest wymagane.'],
    trim: true,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);