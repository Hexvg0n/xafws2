// models/User.ts

import mongoose, { Schema } from 'mongoose';

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
        values: ['root', 'admin', 'adder', 'user'],
        message: 'Rola `{VALUE}` nie jest wspierana.'
    },
    default: 'user',
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
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  batchWishlist: [{ type: Schema.Types.ObjectId, ref: 'Batch' }], // <<< UPEWNIJ SIĘ, ŻE TA LINIA ISTNIEJE
  preferredAgent: { type: String, default: 'ACBUY' },
  preferredCurrency: { type: String, default: 'PLN' },
}, { timestamps: true });

UserSchema.index({ nickname: 1 }, { unique: true, partialFilterExpression: { email: { $exists: false } } });

export default mongoose.models.User || mongoose.model('User', UserSchema);