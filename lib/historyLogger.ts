// lib/historyLogger.ts

import HistoryModel from '@/models/History';
import { type Session } from 'next-auth';

// ZMIANA: Dodajemy 'guide' do listy dozwolonych typów
type Action = 'add' | 'edit' | 'delete';
type Entity = 'product' | 'batch' | 'seller' | 'category' | 'guide';

export async function logHistory(
  session: Session | null,
  action: Action,
  entity: Entity,
  entityId: string,
  details: string
) {
  if (!session?.user?.id || !session?.user?.name) {
    console.error("Attempted to log history without a valid session.");
    return;
  }

  try {
    await HistoryModel.create({
      user: {
        id: session.user.id,
        name: session.user.name,
      },
      action,
      entity,
      entityId,
      details,
    });
  } catch (error) {
    console.error("Failed to log history:", error);
  }
}