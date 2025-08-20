// models/Guide.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ISection {
  title: string;
  content: string; // Będziemy tu przechowywać treść w formacie Markdown
}

export interface IGuide extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  author: string;
  sections: ISection[];
  tags: string[];
}

const SectionSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const GuideSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  author: { type: String, default: 'XaffReps Team' },
  sections: [SectionSchema],
  tags: [String],
}, { timestamps: true });

export default mongoose.models.Guide || mongoose.model<IGuide>('Guide', GuideSchema);