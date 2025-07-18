// models/ChangeRequest.ts

import mongoose from 'mongoose';

const ChangeRequestSchema = new mongoose.Schema({
  requester: { // Kto wysłał prośbę
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: { // Jaka akcja ma być wykonana
    type: String,
    enum: ['dodaj', 'usuń', 'aktualizuj'],
    required: true,
  },
  collectionName: { // Której kolekcji dotyczy zmiana (np. "produkty", "sprzedawcy")
    type: String,
    required: true,
  },
  payload: { // Dane do dodania/aktualizacji
    type: mongoose.Schema.Types.Mixed,
  },
  documentId: { // ID dokumentu do usunięcia/aktualizacji
    type: String,
  },
  status: { // Status prośby
    type: String,
    enum: ['oczekujący', 'zatwierdzony', 'odrzucony'],
    default: 'oczekujący',
  },
  reviewedBy: { // Kto rozpatrzył prośbę (admin lub root)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: {
    type: String,
  }
}, {
  timestamps: true,
});

export default mongoose.models.ChangeRequest || mongoose.model('ChangeRequest', ChangeRequestSchema);