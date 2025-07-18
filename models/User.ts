// models/User.ts

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // ZMIANA: 'email' zastąpiony przez 'nickname'
  nickname: {
    type: String,
    required: [true, 'Proszę podać pseudonim.'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Proszę podać hasło.'],
  },
  role: {
    type: String,
    enum: {
        values: ['root', 'admin', 'adder'],
        message: 'Rola `{VALUE}` nie jest wspierana.'
    },
    default: 'adder',
  },
  status: {
    type: String,
    enum: ['aktywny', 'oczekujący', 'zawieszony', 'zablokowany'],
    default: 'oczekujący',
  },
  //... reszta pól bez zmian
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);