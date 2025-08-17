// models/User.ts

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Proszę podać pseudonim.'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: {
        // Dodajemy nową rolę 'user'
        values: ['root', 'admin', 'adder', 'user'],
        message: 'Rola `{VALUE}` nie jest wspierana.'
    },
    default: 'user', // 'user' jest teraz domyślną rolą
  },
  status: {
    type: String,
    enum: ['aktywny', 'oczekujący', 'zawieszony', 'zablokowany'],
    default: 'aktywny',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

UserSchema.index({ nickname: 1 }, { unique: true, partialFilterExpression: { email: { $exists: false } } });

export default mongoose.models.User || mongoose.model('User', UserSchema);