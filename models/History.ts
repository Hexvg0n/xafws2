// models/History.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
  user: {
    id: Schema.Types.ObjectId;
    name: string;
  };
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

const HistorySchema: Schema = new Schema({
  user: {
    id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
  },
  action: { type: String, required: true, enum: ['add', 'edit', 'delete'] },
  entity: { type: String, required: true, enum: ['product', 'batch', 'seller', 'category'] },
  entityId: { type: String, required: true },
  details: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.History || mongoose.model<IHistory>('History', HistorySchema);